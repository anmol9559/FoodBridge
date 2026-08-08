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

async function getRestaurantsForAdmin({ page = 1, limit = 10, search }) {
  const skip = (page - 1) * limit

  const where = {
    type: 'RESTAURANT',
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  }

  const [organizations, totalItems] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        registrationNumber: true,
        createdAt: true,
        users: {
          where: {
            deletedAt: null,
          },
          take: 1,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    }),
    prisma.organization.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit) || 0

  const restaurants = organizations.map((org) => {
    const owner = org.users && org.users.length > 0 ? org.users[0] : null
    return {
      id: org.id,
      name: org.name,
      email: org.email,
      phone: org.phone,
      registrationNumber: org.registrationNumber,
      createdAt: org.createdAt,
      owner: owner
        ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            phone: owner.phone,
          }
        : null,
    }
  })

  return {
    restaurants,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  }
}

async function getNgosForAdmin({ page = 1, limit = 10, search }) {
  const skip = (page - 1) * limit

  const where = {
    type: 'NGO',
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  }

  const [organizations, totalItems] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        registrationNumber: true,
        createdAt: true,
        users: {
          where: {
            deletedAt: null,
          },
          take: 1,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    }),
    prisma.organization.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit) || 0

  const ngos = organizations.map((org) => {
    const owner = org.users && org.users.length > 0 ? org.users[0] : null
    return {
      id: org.id,
      name: org.name,
      email: org.email,
      phone: org.phone,
      registrationNumber: org.registrationNumber,
      createdAt: org.createdAt,
      owner: owner
        ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            phone: owner.phone,
          }
        : null,
    }
  })

  return {
    ngos,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  }
}

module.exports = {
  getAdminDashboardStats,
  getRestaurantsForAdmin,
  getNgosForAdmin,
}


