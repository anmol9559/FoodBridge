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
    expiredDonations,
    recoveredDonations,
    recoveryPendingDonations,
    cattleFeedDonations,
    compostDonations,
    biogasDonations,
    organicFertilizerDonations,
    animalShelterDonations,
    safeDisposalDonations,
    totalReservations,
    pendingReservations,
    confirmedReservations,
    completedReservations,
  ] = await Promise.all([
    prisma.organization.count({ where: { type: 'RESTAURANT', deletedAt: null } }),
    prisma.organization.count({ where: { type: 'NGO', deletedAt: null } }),
    prisma.foodDonation.count({ where: { deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'AVAILABLE', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RESERVED', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'COMPLETED', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'CANCELLED', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'EXPIRED', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERY_PENDING', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', recoveryMethod: 'CATTLE_FEED', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', recoveryMethod: 'COMPOST', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', recoveryMethod: 'BIOGAS', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', recoveryMethod: 'ORGANIC_FERTILIZER', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', recoveryMethod: 'ANIMAL_SHELTER', deletedAt: null } }),
    prisma.foodDonation.count({ where: { status: 'RECOVERED', recoveryMethod: 'SAFE_DISPOSAL', deletedAt: null } }),
    prisma.reservation.count({ where: { deletedAt: null } }),
    prisma.reservation.count({ where: { status: 'PENDING', deletedAt: null } }),
    prisma.reservation.count({ where: { status: 'CONFIRMED', deletedAt: null } }),
    prisma.reservation.count({ where: { status: 'COMPLETED', deletedAt: null } }),
  ])

  const totalExpiredAndRecovered = expiredDonations + recoveredDonations
  const recoveryPercentage = totalExpiredAndRecovered > 0
    ? Number(((recoveredDonations / totalExpiredAndRecovered) * 100).toFixed(1))
    : 0

  return {
    totalRestaurants,
    totalNgos,
    totalDonations,
    availableDonations,
    reservedDonations,
    completedDonations,
    cancelledDonations,
    expiredDonations,
    recoveredDonations,
    recoveryPendingDonations,
    cattleFeedDonations,
    compostDonations,
    biogasDonations,
    organicFertilizerDonations,
    animalShelterDonations,
    safeDisposalDonations,
    recoveryPercentage,
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
            { registrationNumber: { contains: search } },
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
        verificationStatus: true,
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
      verificationStatus: org.verificationStatus,
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
            { registrationNumber: { contains: search } },
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
        verificationStatus: true,
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
      verificationStatus: org.verificationStatus,
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

async function getDonationsForAdmin({ page = 1, limit = 10, status, search }) {
  const skip = (page - 1) * limit

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { recoveryNotes: { contains: search } },
            { recoveryMethod: { contains: search } },
            { restaurant: { name: { contains: search } } },
          ],
        }
      : {}),
  }

  const [donations, totalItems] = await prisma.$transaction([
    prisma.foodDonation.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        quantity: true,
        quantityUnit: true,
        foodType: true,
        mealType: true,
        packagingType: true,
        status: true,
        recoveryMethod: true,
        recoveryNotes: true,
        recoveredAt: true,
        recoveredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        estimatedServings: true,
        pickupAddress: true,
        createdAt: true,
        expiresAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }),
    prisma.foodDonation.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit) || 0

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

async function getReservationsForAdmin({ page = 1, limit = 10, status }) {
  const skip = (page - 1) * limit

  const where = {
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
            status: true,
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
        reservedBy: {
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

async function getPendingOrganizationsForAdmin({ status, type, search } = {}) {
  const where = {
    deletedAt: null,
    ...(status ? { verificationStatus: status } : { verificationStatus: 'PENDING' }),
    ...(type ? { type } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
            { registrationNumber: { contains: search } },
          ],
        }
      : {}),
  }

  const organizations = await prisma.organization.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      logoImageUrl: true,
      websiteUrl: true,
      registrationNumber: true,
      email: true,
      phone: true,
      verificationStatus: true,
      rejectionReason: true,
      verifiedAt: true,
      verifiedById: true,
      verifiedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      rejectedAt: true,
      rejectedById: true,
      rejectedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
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
          createdAt: true,
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
          googleMapsUrl: true,
        },
      },
    },
  })

  return { organizations }
}

const bcrypt = require('bcryptjs')

async function verifyOrganizationForAdmin({ id, status, reason, adminUserId, adminPassword }) {
  const adminUser = await prisma.user.findFirst({
    where: { id: adminUserId, deletedAt: null },
  })

  if (!adminUser) {
    return { error: 'UNAUTHORIZED', message: 'Admin session user not found.' }
  }

  const isValidPassword = await bcrypt.compare(adminPassword, adminUser.passwordHash)
  if (!isValidPassword) {
    return { error: 'INVALID_PASSWORD', message: 'Invalid admin password. Verification failed.' }
  }

  const existing = await prisma.organization.findFirst({
    where: { id, deletedAt: null },
  })

  if (!existing) {
    return { error: 'NOT_FOUND', message: 'Organization not found.' }
  }

  if (status === 'REJECTED' && (!reason || !reason.trim())) {
    return { error: 'REASON_REQUIRED', message: 'A rejection reason is required when rejecting an organization.' }
  }

  const isApproved = status === 'VERIFIED'
  const updated = await prisma.organization.update({
    where: { id },
    data: {
      verificationStatus: status,
      verifiedAt: isApproved ? new Date() : existing.verifiedAt,
      verifiedById: isApproved ? adminUserId : existing.verifiedById,
      rejectedAt: !isApproved ? new Date() : null,
      rejectedById: !isApproved ? adminUserId : null,
      rejectionReason: !isApproved ? reason.trim() : null,
    },
    select: {
      id: true,
      name: true,
      type: true,
      email: true,
      phone: true,
      verificationStatus: true,
      rejectionReason: true,
      verifiedAt: true,
      verifiedById: true,
      verifiedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      rejectedAt: true,
      rejectedById: true,
      rejectedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  })

  return { success: true, organization: updated }
}

module.exports = {
  getAdminDashboardStats,
  getRestaurantsForAdmin,
  getNgosForAdmin,
  getDonationsForAdmin,
  getReservationsForAdmin,
  getPendingOrganizationsForAdmin,
  verifyOrganizationForAdmin,
}
