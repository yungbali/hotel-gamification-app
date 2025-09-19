// GraphQL Queries for Hotel Gamification App
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

// Hotel Queries
export const listHotels = /* GraphQL */ `
  query ListHotels {
    listHotels {
      items {
        id
        name
        address
        timezone
        createdAt
        updatedAt
      }
    }
  }
`;

export const getHotel = /* GraphQL */ `
  query GetHotel($id: ID!) {
    getHotel(id: $id) {
      id
      name
      address
      timezone
      createdAt
      updatedAt
    }
  }
`;

// User Queries
export const listUsers = /* GraphQL */ `
  query ListUsers($filter: ModelUserFilterInput) {
    listUsers(filter: $filter) {
      items {
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
  }
`;

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      hotel {
        id
        name
        address
        timezone
      }
      badges {
        items {
          id
          type
          name
          description
          icon
          earnedAt
        }
      }
    }
  }
`;

// Rating Queries
export const listRatings = /* GraphQL */ `
  query ListRatings($filter: ModelRatingFilterInput, $limit: Int, $nextToken: String) {
    listRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        waiter {
          id
          name
          email
        }
      }
      nextToken
    }
  }
`;

export const getRating = /* GraphQL */ `
  query GetRating($id: ID!) {
    getRating(id: $id) {
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
      waiter {
        id
        name
        email
      }
      hotel {
        id
        name
      }
    }
  }
`;

// QR Code Queries
export const listQRCodes = /* GraphQL */ `
  query ListQRCodes($filter: ModelQRCodeFilterInput) {
    listQRCodes(filter: $filter) {
      items {
        id
        waiterId
        shiftId
        token
        url
        isUsed
        usedAt
        expiresAt
        createdAt
        waiter {
          id
          name
        }
        shift {
          id
          startTime
          endTime
          isActive
        }
      }
    }
  }
`;

// Shift Queries
export const listShifts = /* GraphQL */ `
  query ListShifts($filter: ModelShiftFilterInput) {
    listShifts(filter: $filter) {
      items {
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
        waiter {
          id
          name
        }
      }
    }
  }
`;

export const getShift = /* GraphQL */ `
  query GetShift($id: ID!) {
    getShift(id: $id) {
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
      waiter {
        id
        name
        email
      }
      hotel {
        id
        name
      }
      qrCodes {
        items {
          id
          token
          url
          isUsed
          expiresAt
        }
      }
    }
  }
`;

// Badge Queries
export const listBadges = /* GraphQL */ `
  query ListBadges($filter: ModelBadgeFilterInput) {
    listBadges(filter: $filter) {
      items {
        id
        waiterId
        type
        name
        description
        icon
        earnedAt
        criteria
        waiter {
          id
          name
        }
      }
    }
  }
`;

// Analytics Queries
export const listAnalytics = /* GraphQL */ `
  query ListAnalytics($filter: ModelAnalyticsFilterInput) {
    listAnalytics(filter: $filter) {
      items {
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
  }
`;

// Custom Leaderboard Query
export const getLeaderboard = /* GraphQL */ `
  query GetLeaderboard($hotelId: ID!, $period: String!) {
    listUsers(filter: { hotelId: { eq: $hotelId }, role: { eq: waiter } }) {
      items {
        id
        name
        email
        points
        level
        totalRatings
        averageRating
        badges {
          items {
            id
            type
            name
            earnedAt
          }
        }
      }
    }
  }
`;

export { client };
