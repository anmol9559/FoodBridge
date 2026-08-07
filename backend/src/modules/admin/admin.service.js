const prisma = require('../../lib/prisma')

async function getAdminDashboardStats() {
  const [
    totalRestaurants,
    totalNgos,
    totalDonations,
    availableDonations,
    reservedDonations,
    completedDonations,
    cancelledDonations,
    totalReservations,
    pendingReservations,
    confirmedReservations,
    completedReservations,
  ] = await prisma.$transaction([
    prisma.organization.count({
      where: { type: 'RESTAURANT', deletedAt: null },
    }),
    prisma.organization.count({
      where: { type: 'NGO', deletedAt: null },
    }),
    prisma.foodDonation.count({
      where: { deletedAt: null },
    }),
    prisma.foodDonation.count({
      where: { status: 'AVAILABLE', deletedAt: null },
    }),
    prisma.foodDonation.count({
      where: { status: 'RESERVED', deletedAt: null },
    }),
    prisma.foodDonation.count({
      where: { status: 'COMPLETED', deletedAt: null },
    }),
    prisma.foodDonation.count({
      where: { status: 'CANCELLED', deletedAt: null },
    }),
    prisma.reservation.count({
      where: { deletedAt: null },
    }),
    prisma.reservation.count({
      where: { status: 'PENDING', deletedAt: null },
    }),
    prisma.reservation.count({
      where: { status: 'CONFIRMED', deletedAt: null },
    }),
    prisma.reservation.count({
      where: { status: 'COMPLETED', deletedAt: null },
    }),
  ])

  return {
    totalRestaurants,
    totalNgos,
    totalDonations,
    availableDonations,
    reservedDonations,
    completedDonations,
    cancelledDonations,
    totalReservations,
    pendingReservations,
    confirmedReservations,
    completedReservations,
  }
}

module.exports = {
  getAdminDashboardStats,
}
