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

module.exports = { createDonation, getRestaurantDonations, getDonationById, updateDonation, softDeleteDonation }




