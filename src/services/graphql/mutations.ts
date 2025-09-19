// GraphQL Mutations for Hotel Gamification App
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

// Hotel Mutations
export const createHotel = /* GraphQL */ `
  mutation CreateHotel($input: CreateHotelInput!) {
    createHotel(input: $input) {
      id
      name
      address
      timezone
      createdAt
      updatedAt
    }
  }
`;

export const updateHotel = /* GraphQL */ `
  mutation UpdateHotel($input: UpdateHotelInput!) {
    updateHotel(input: $input) {
      id
      name
      address
      timezone
      createdAt
      updatedAt
    }
  }
`;

// User Mutations
export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      role
      hotelId
      points
      level
      totalRatings
      averageRating
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      name
      role
      hotelId
      points
      level
      totalRatings
      averageRating
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;

// Rating Mutations
export const createRating = /* GraphQL */ `
  mutation CreateRating($input: CreateRatingInput!) {
    createRating(input: $input) {
      id
      waiterId
      hotelId
      rating
      serviceRating
      foodRating
      ambianceRating
      comment
      tableNumber
      guestName
      timestamp
      qrToken
      deviceInfo
      isFlagged
      flaggedReason
      isResolved
      resolvedBy
      resolvedAt
      resolutionNotes
    }
  }
`;

export const updateRating = /* GraphQL */ `
  mutation UpdateRating($input: UpdateRatingInput!) {
    updateRating(input: $input) {
      id
      waiterId
      hotelId
      rating
      serviceRating
      foodRating
      ambianceRating
      comment
      tableNumber
      guestName
      timestamp
      qrToken
      isFlagged
      flaggedReason
      isResolved
      resolvedBy
      resolvedAt
      resolutionNotes
    }
  }
`;

export const deleteRating = /* GraphQL */ `
  mutation DeleteRating($input: DeleteRatingInput!) {
    deleteRating(input: $input) {
      id
    }
  }
`;

// QR Code Mutations
export const createQRCode = /* GraphQL */ `
  mutation CreateQRCode($input: CreateQRCodeInput!) {
    createQRCode(input: $input) {
      id
      waiterId
      shiftId
      token
      url
      isUsed
      usedAt
      expiresAt
      createdAt
    }
  }
`;

export const updateQRCode = /* GraphQL */ `
  mutation UpdateQRCode($input: UpdateQRCodeInput!) {
    updateQRCode(input: $input) {
      id
      waiterId
      shiftId
      token
      url
      isUsed
      usedAt
      expiresAt
      createdAt
    }
  }
`;

// Shift Mutations
export const createShift = /* GraphQL */ `
  mutation CreateShift($input: CreateShiftInput!) {
    createShift(input: $input) {
      id
      waiterId
      hotelId
      startTime
      endTime
      isActive
      pointsEarned
      ratingsCount
      averageRating
      totalTips
    }
  }
`;

export const updateShift = /* GraphQL */ `
  mutation UpdateShift($input: UpdateShiftInput!) {
    updateShift(input: $input) {
      id
      waiterId
      hotelId
      startTime
      endTime
      isActive
      pointsEarned
      ratingsCount
      averageRating
      totalTips
    }
  }
`;

// Badge Mutations
export const createBadge = /* GraphQL */ `
  mutation CreateBadge($input: CreateBadgeInput!) {
    createBadge(input: $input) {
      id
      waiterId
      type
      name
      description
      icon
      earnedAt
      criteria
    }
  }
`;

export const updateBadge = /* GraphQL */ `
  mutation UpdateBadge($input: UpdateBadgeInput!) {
    updateBadge(input: $input) {
      id
      waiterId
      type
      name
      description
      icon
      earnedAt
      criteria
    }
  }
`;

// Analytics Mutations
export const createAnalytics = /* GraphQL */ `
  mutation CreateAnalytics($input: CreateAnalyticsInput!) {
    createAnalytics(input: $input) {
      id
      hotelId
      period
      date
      totalRatings
      averageRating
      totalPoints
      activeWaiters
      topWaiterId
      metrics
    }
  }
`;

export const updateAnalytics = /* GraphQL */ `
  mutation UpdateAnalytics($input: UpdateAnalyticsInput!) {
    updateAnalytics(input: $input) {
      id
      hotelId
      period
      date
      totalRatings
      averageRating
      totalPoints
      activeWaiters
      topWaiterId
      metrics
    }
  }
`;

export { client };
