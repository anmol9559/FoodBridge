const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const env = require('../../config/env')
const prisma = require('../../lib/prisma')

const BCRYPT_ROUNDS = 12

async function registerUser(input) {
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)

  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: input.organization.name,
        type: input.role,
        registrationNumber: input.organization.registrationNumber,
        email: input.organization.email,
        phone: input.organization.phone,
        description: input.organization.description,
        websiteUrl: input.organization.websiteUrl,
        verificationStatus: 'PENDING',
      },
      select: {
        id: true,
        name: true,
        type: true,
        verificationStatus: true,
      },
    })

    const user = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        phone: input.phone,
        role: input.role,
        organizationId: organization.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return { user, organization }
  })
}

function getDurationInMilliseconds(value) {
  const match = value.match(/^(\d+)([smhd])$/)
  if (!match) return 15 * 60 * 1000
  const [, amount, unit] = match
  const multiplier = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit]

  return Number(amount) * multiplier
}

function createRefreshToken() {
  return crypto.randomBytes(64).toString('base64url')
}

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

async function loginUser({ email, password, ipAddress, userAgent }) {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          type: true,
          logoImageUrl: true,
          verificationStatus: true,
          rejectionReason: true,
          isActive: true,
          deletedAt: true,
        },
      },
    },
  })

  // User does not exist
  if (!user) {
    return { error: 'INVALID_CREDENTIALS' }
  }

  // Account is deactivated
  if (user.isActive === false) {
    return { error: 'ACCOUNT_DISABLED', message: 'Your account has been disabled. Please contact support.' }
  }

  // Non-Admin account must have an active organization
  if (user.role !== 'ADMIN') {
    if (!user.organization || user.organization.deletedAt || user.organization.isActive === false) {
      return { error: 'ACCOUNT_DISABLED', message: 'Your organization account is inactive or disabled.' }
    }
  }

  // Verify Password
  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) {
    return { error: 'INVALID_CREDENTIALS' }
  }

  // Verification Check for Non-Admin accounts
  if (user.role !== 'ADMIN') {
    const vStatus = user.organization?.verificationStatus || 'PENDING'
    if (vStatus === 'PENDING') {
      return { error: 'ORGANIZATION_PENDING', message: 'Your organization is waiting for admin approval.' }
    }
    if (vStatus === 'REJECTED') {
      return { error: 'ORGANIZATION_REJECTED', message: 'Your organization has been rejected by the administrator.' }
    }
  }

  // Generate Tokens
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role, organizationId: user.organizationId },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN, issuer: 'foodbridge-api', audience: 'foodbridge-web' },
  )
  const refreshToken = createRefreshToken()
  const now = new Date()

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: now },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        tokenFamily: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(now.getTime() + getDurationInMilliseconds(env.JWT_REFRESH_EXPIRES_IN)),
        ipAddress: ipAddress?.slice(0, 45),
        userAgent: userAgent?.slice(0, 512),
        lastUsedAt: now,
      },
    }),
  ])

  return {
    accessToken,
    refreshToken,
    role: user.role,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profileImageUrl: user.profileImageUrl,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: now,
      organizationId: user.organizationId,
    },
    organization: user.organization
      ? {
          id: user.organization.id,
          name: user.organization.name,
          type: user.organization.type,
          logoImageUrl: user.organization.logoImageUrl,
          verificationStatus: user.organization.verificationStatus || 'PENDING',
          rejectionReason: user.organization.rejectionReason,
        }
      : null,
  }
}

async function getCurrentUser(userId) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      profileImageUrl: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      organization: {
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
          createdAt: true,
        },
      },
    },
  })
}

async function resubmitOrganization({ userId, name, phone, description, websiteUrl, registrationNumber }) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { organizationId: true },
  })

  if (!user || !user.organizationId) {
    return null
  }

  const updatedOrg = await prisma.organization.update({
    where: { id: user.organizationId },
    data: {
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(websiteUrl !== undefined ? { websiteUrl } : {}),
      ...(registrationNumber !== undefined ? { registrationNumber } : {}),
      verificationStatus: 'PENDING',
      rejectionReason: null,
    },
    select: {
      id: true,
      name: true,
      type: true,
      verificationStatus: true,
      updatedAt: true,
    },
  })

  return updatedOrg
}

module.exports = { loginUser, registerUser, getCurrentUser, resubmitOrganization }
