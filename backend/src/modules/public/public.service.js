const prisma = require('../../lib/prisma')

async function getPublicPlatformStats() {
  const [
    verifiedRestaurants,
    verifiedNgos,
    totalDonations,
    completedPickups,
    mealsAggregate,
  ] = await Promise.all([
    prisma.organization.count({
      where: {
        type: 'RESTAURANT',
        verificationStatus: 'VERIFIED',
        isActive: true,
        deletedAt: null,
      },
    }),
    prisma.organization.count({
      where: {
        type: 'NGO',
        verificationStatus: 'VERIFIED',
        isActive: true,
        deletedAt: null,
      },
    }),
    prisma.foodDonation.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.reservation.count({
      where: {
        status: 'COMPLETED',
        deletedAt: null,
      },
    }),
    prisma.foodDonation.aggregate({
      where: {
        status: { in: ['COMPLETED', 'PICKED_UP', 'COLLECTED'] },
        deletedAt: null,
      },
      _sum: {
        estimatedServings: true,
      },
    }),
  ])

  return {
    verifiedRestaurants: verifiedRestaurants || 0,
    verifiedNgos: verifiedNgos || 0,
    totalDonations: totalDonations || 0,
    completedPickups: completedPickups || 0,
    mealsSaved: mealsAggregate._sum.estimatedServings || 0,
  }
}

module.exports = { getPublicPlatformStats }
