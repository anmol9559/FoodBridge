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
    expiresAt: {
      gt: new Date(),
    },
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

    const activeReservation = await tx.reservation.findFirst({
      where: {
        donationId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        deletedAt: null,
      },
    })

    if (activeReservation) {
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

// NGO list API: STRICTLY DOES NOT SELECT pickupVerificationCode FOR SECURITY
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
        pickupVerifiedAt: true,
        reservedAt: true,
        createdAt: true,
        updatedAt: true,
        donation: {
          select: {
            id: true,
            title: true,
            description: true,
            quantity: true,
            quantityUnit: true,
            foodType: true,
            mealType: true,
            packagingType: true,
            isVegetarian: true,
            isVegan: true,
            cookedAt: true,
            expiresAt: true,
            pickupAddress: true,
            latitude: true,
            longitude: true,
            estimatedServings: true,
            specialInstructions: true,
            status: true,
            restaurant: {
              select: {
                id: true,
                name: true,
                type: true,
                description: true,
                logoImageUrl: true,
                email: true,
                phone: true,
                websiteUrl: true,
                users: {
                  where: { deletedAt: null },
                  take: 1,
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    profileImageUrl: true,
                  },
                },
                locations: {
                  where: { deletedAt: null },
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
                  },
                },
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

// RESTAURANT list API: EXCLUSIVELY SELECTS pickupVerificationCode & pickupVerificationExpiresAt FOR RESTAURANT DASHBOARD
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
        pickupVerificationCode: true,
        pickupVerificationExpiresAt: true,
        pickupVerifiedAt: true,
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

    // Generate random 6-digit numeric PIN
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 Hours Expiry

    const updatedReservation = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CONFIRMED',
        pickupVerificationCode: generatedPin,
        pickupVerificationExpiresAt: expiresAt,
        pickupCode: generatedPin,
      },
      select: {
        id: true,
        status: true,
        pickupVerificationCode: true,
        pickupVerificationExpiresAt: true,
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
        pickupVerificationCode: updatedReservation.pickupVerificationCode,
        pickupVerificationExpiresAt: updatedReservation.pickupVerificationExpiresAt,
        donationTitle: updatedReservation.donation.title,
        ngoName: updatedReservation.ngo.name,
      },
    }
  })
}

async function regeneratePickupPinForRestaurant({ reservationId, restaurantId }) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findFirst({
      where: {
        id: reservationId,
        deletedAt: null,
      },
      include: {
        donation: {
          select: {
            restaurantId: true,
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

    if (reservation.status !== 'CONFIRMED') {
      return { status: 'INVALID_STATUS' }
    }

    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const updatedReservation = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        pickupVerificationCode: generatedPin,
        pickupVerificationExpiresAt: expiresAt,
        pickupCode: generatedPin,
      },
      select: {
        id: true,
        pickupVerificationCode: true,
        pickupVerificationExpiresAt: true,
      },
    })

    return {
      status: 'SUCCESS',
      data: updatedReservation,
    }
  })
}

async function rejectReservationForRestaurant({ reservationId, restaurantId }) {
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
      data: { status: 'REJECTED' },
      select: {
        id: true,
        status: true,
      },
    })

    const updatedDonation = await tx.foodDonation.update({
      where: { id: reservation.donation.id },
      data: { status: 'AVAILABLE' },
      select: {
        title: true,
        status: true,
      },
    })

    return {
      status: 'SUCCESS',
      data: {
        id: updatedReservation.id,
        status: updatedReservation.status,
        donationTitle: updatedDonation.title,
        donationStatus: updatedDonation.status,
      },
    }
  })
}

async function verifyAndCompletePickupForNgo({ reservationId, ngoId, code }) {
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
          },
        },
      },
    })

    if (!reservation) {
      return { status: 'NOT_FOUND' }
    }

    if (reservation.ngoId !== ngoId) {
      return { status: 'FORBIDDEN' }
    }

    if (reservation.status !== 'CONFIRMED') {
      return { status: 'INVALID_STATUS' }
    }

    const trimmedInputCode = code ? code.toString().trim() : ''
    const storedCode = reservation.pickupVerificationCode || reservation.pickupCode

    // 1. Verify code matches
    if (!storedCode || trimmedInputCode !== storedCode.trim()) {
      return {
        status: 'INVALID_PICKUP_CODE',
        message: 'Invalid pickup code',
      }
    }

    // 2. Verify code not expired
    if (reservation.pickupVerificationExpiresAt && new Date() > new Date(reservation.pickupVerificationExpiresAt)) {
      return {
        status: 'PICKUP_CODE_EXPIRED',
        message: 'Pickup code expired',
      }
    }

    const now = new Date()

    // 3. Mark Reservation & Donation COMPLETED, set pickupVerifiedAt, and clear PIN
    const updatedReservation = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'COMPLETED',
        pickupVerifiedAt: now,
        pickupVerificationCode: null,
        pickupVerificationExpiresAt: null,
        pickupCode: null,
      },
      select: {
        id: true,
        status: true,
        pickupVerifiedAt: true,
      },
    })

    const updatedDonation = await tx.foodDonation.update({
      where: { id: reservation.donation.id },
      data: { status: 'COMPLETED' },
      select: {
        title: true,
      },
    })

    return {
      status: 'SUCCESS',
      data: {
        id: updatedReservation.id,
        status: updatedReservation.status,
        pickupVerifiedAt: updatedReservation.pickupVerifiedAt,
        donationTitle: updatedDonation.title,
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
  regeneratePickupPinForRestaurant,
  rejectReservationForRestaurant,
  verifyAndCompletePickupForNgo,
  completePickupForNgo: verifyAndCompletePickupForNgo,
}
