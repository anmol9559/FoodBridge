const prisma = require('../../lib/prisma')

async function createDonation(restaurantId, input) {
  const donation = await prisma.foodDonation.create({
    data: {
      restaurantId,
      title: input.title,
      description: input.description,
      quantity: input.quantity,
      quantityUnit: input.quantityUnit,
      foodType: input.foodType,
      mealType: input.mealType,
      packagingType: input.packagingType,
      isVegetarian: input.isVegetarian,
      isVegan: input.isVegan,
      estimatedServings: input.estimatedServings,
      cookedAt: input.cookedAt,
      expiresAt: input.expiresAt,
      pickupAddress: input.pickupAddress,
      latitude: input.latitude,
      longitude: input.longitude,
      specialInstructions: input.specialInstructions,
      images: input.images || undefined,
      status: 'AVAILABLE',
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          type: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  return donation
}

async function getRestaurantDonations(restaurantId, { page = 1, limit = 10, status, search }) {
  const skip = (page - 1) * limit

  const where = {
    restaurantId,
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { title: { contains: search } } : {}),
  }

  const [donations, totalItems] = await prisma.$transaction([
    prisma.foodDonation.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.foodDonation.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit)

  return {
    donations,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  }
}

async function getDonationById(donationId) {
  return prisma.foodDonation.findFirst({
    where: {
      id: donationId,
      deletedAt: null,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          type: true,
          email: true,
          phone: true,
        },
      },
    },
  })
}

async function updateDonation(donationId, updateData) {
  const { images, ...fields } = updateData

  return prisma.foodDonation.update({
    where: { id: donationId },
    data: {
      ...fields,
      ...(images !== undefined ? { images } : {}),
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          type: true,
          email: true,
          phone: true,
        },
      },
    },
  })
}

async function softDeleteDonation(donationId) {
  return prisma.foodDonation.update({
    where: { id: donationId },
    data: {
      deletedAt: new Date(),
    },
  })
}

async function getAvailableDonationsForNgo({ page = 1, limit = 10, search }) {
  const skip = (page - 1) * limit

  const where = {
    status: 'AVAILABLE',
    deletedAt: null,
    restaurant: {
      isActive: true,
      deletedAt: null,
    },
    ...(search ? { title: { contains: search } } : {}),
  }

  const [donations, totalItems] = await prisma.$transaction([
    prisma.foodDonation.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            type: true,
            email: true,
            phone: true,
            locations: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                label: true,
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                postalCode: true,
                countryCode: true,
                latitude: true,
                longitude: true,
                isPrimary: true,
              },
            },
          },
        },
      },
    }),
    prisma.foodDonation.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit)

  return {
    donations,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  }
}

async function reserveDonationForNgo({ donationId, ngoId, userId, notes }) {
  return prisma.$transaction(async (tx) => {
    const donation = await tx.foodDonation.findFirst({
      where: {
        id: donationId,
        deletedAt: null,
      },
    })

    if (!donation) {
      return { status: 'NOT_FOUND' }
    }

    if (donation.status !== 'AVAILABLE') {
      return { status: 'UNAVAILABLE' }
    }

    await tx.foodDonation.update({
      where: { id: donationId },
      data: { status: 'RESERVED' },
    })

    const reservation = await tx.reservation.create({
      data: {
        donationId,
        ngoId,
        reservedById: userId,
        status: 'PENDING',
        notes: notes || undefined,
      },
      include: {
        donation: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return { status: 'SUCCESS', reservation }
  })
}

async function getNgoReservations(ngoId, { page = 1, limit = 10, status }) {
  const skip = (page - 1) * limit

  const where = {
    ngoId,
    deletedAt: null,
    ...(status ? { status } : {}),
  }

  const [reservations, totalItems] = await prisma.$transaction([
    prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        notes: true,
        createdAt: true,
        donation: {
          select: {
            id: true,
            title: true,
            quantity: true,
            quantityUnit: true,
            foodType: true,
            mealType: true,
            pickupAddress: true,
            expiresAt: true,
            status: true,
            restaurant: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    }),
    prisma.reservation.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit) || 0

  return {
    reservations,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  }
}

async function getRestaurantReservations(restaurantId, { page = 1, limit = 10, status }) {
  const skip = (page - 1) * limit

  const where = {
    deletedAt: null,
    donation: {
      restaurantId,
    },
    ...(status ? { status } : {}),
  }

  const [reservations, totalItems] = await prisma.$transaction([
    prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        notes: true,
        createdAt: true,
        donation: {
          select: {
            id: true,
            title: true,
            quantity: true,
            quantityUnit: true,
            foodType: true,
            mealType: true,
            pickupAddress: true,
            expiresAt: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        reservedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
      },
    }),
    prisma.reservation.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit) || 0

  return {
    reservations,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  }
}

async function confirmReservationForRestaurant({ reservationId, restaurantId }) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findFirst({
      where: {
        id: reservationId,
        deletedAt: null,
      },
      include: {
        donation: {
          select: {
            id: true,
            title: true,
            restaurantId: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!reservation) {
      return { status: 'NOT_FOUND' }
    }

    if (reservation.donation.restaurantId !== restaurantId) {
      return { status: 'FORBIDDEN' }
    }

    if (reservation.status !== 'PENDING') {
      return { status: 'INVALID_STATUS' }
    }

    const updatedReservation = await tx.reservation.update({
      where: { id: reservationId },
      data: { status: 'CONFIRMED' },
      select: {
        id: true,
        status: true,
        donation: {
          select: {
            title: true,
          },
        },
        ngo: {
          select: {
            name: true,
          },
        },
      },
    })

    return {
      status: 'SUCCESS',
      data: {
        id: updatedReservation.id,
        status: updatedReservation.status,
        donationTitle: updatedReservation.donation.title,
        ngoName: updatedReservation.ngo.name,
      },
    }
  })
}

module.exports = {
  createDonation,
  getRestaurantDonations,
  getDonationById,
  updateDonation,
  softDeleteDonation,
  getAvailableDonationsForNgo,
  reserveDonationForNgo,
  getNgoReservations,
  getRestaurantReservations,
  confirmReservationForRestaurant,
}









