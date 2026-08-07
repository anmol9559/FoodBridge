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

module.exports = { createDonation }
