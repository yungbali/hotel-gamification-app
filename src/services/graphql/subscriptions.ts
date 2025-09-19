/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAnalytics = /* GraphQL */ `subscription OnCreateAnalytics($filter: ModelSubscriptionAnalyticsFilterInput) {
  onCreateAnalytics(filter: $filter) {
    activeWaiters
    averageRating
    createdAt
    date
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    metrics
    period
    topWaiterId
    totalPoints
    totalRatings
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAnalyticsSubscriptionVariables,
  APITypes.OnCreateAnalyticsSubscription
>;
export const onCreateBadge = /* GraphQL */ `subscription OnCreateBadge($filter: ModelSubscriptionBadgeFilterInput) {
  onCreateBadge(filter: $filter) {
    createdAt
    criteria
    description
    earnedAt
    icon
    id
    name
    type
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateBadgeSubscriptionVariables,
  APITypes.OnCreateBadgeSubscription
>;
export const onCreateHotel = /* GraphQL */ `subscription OnCreateHotel($filter: ModelSubscriptionHotelFilterInput) {
  onCreateHotel(filter: $filter) {
    address
    analyticsEntries {
      nextToken
      __typename
    }
    createdAt
    id
    name
    ratings {
      nextToken
      __typename
    }
    shifts {
      nextToken
      __typename
    }
    timezone
    updatedAt
    users {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateHotelSubscriptionVariables,
  APITypes.OnCreateHotelSubscription
>;
export const onCreateQRCode = /* GraphQL */ `subscription OnCreateQRCode($filter: ModelSubscriptionQRCodeFilterInput) {
  onCreateQRCode(filter: $filter) {
    createdAt
    expiresAt
    id
    isUsed
    shift {
      averageRating
      createdAt
      endTime
      hotelId
      id
      isActive
      pointsEarned
      ratingsCount
      startTime
      totalTips
      updatedAt
      waiterId
      __typename
    }
    shiftId
    token
    updatedAt
    url
    usedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateQRCodeSubscriptionVariables,
  APITypes.OnCreateQRCodeSubscription
>;
export const onCreateRating = /* GraphQL */ `subscription OnCreateRating($filter: ModelSubscriptionRatingFilterInput) {
  onCreateRating(filter: $filter) {
    ambianceRating
    comment
    createdAt
    deviceInfo
    flaggedReason
    foodRating
    guestName
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isFlagged
    isResolved
    qrToken
    rating
    resolutionNotes
    resolvedAt
    resolvedBy
    serviceRating
    tableNumber
    timestamp
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRatingSubscriptionVariables,
  APITypes.OnCreateRatingSubscription
>;
export const onCreateShift = /* GraphQL */ `subscription OnCreateShift($filter: ModelSubscriptionShiftFilterInput) {
  onCreateShift(filter: $filter) {
    averageRating
    createdAt
    endTime
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isActive
    pointsEarned
    qrCodes {
      nextToken
      __typename
    }
    ratingsCount
    startTime
    totalTips
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateShiftSubscriptionVariables,
  APITypes.OnCreateShiftSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
    averageRating
    badges {
      nextToken
      __typename
    }
    createdAt
    email
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isActive
    level
    name
    points
    qrCodes {
      nextToken
      __typename
    }
    ratings {
      nextToken
      __typename
    }
    role
    shifts {
      nextToken
      __typename
    }
    totalRatings
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onDeleteAnalytics = /* GraphQL */ `subscription OnDeleteAnalytics($filter: ModelSubscriptionAnalyticsFilterInput) {
  onDeleteAnalytics(filter: $filter) {
    activeWaiters
    averageRating
    createdAt
    date
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    metrics
    period
    topWaiterId
    totalPoints
    totalRatings
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAnalyticsSubscriptionVariables,
  APITypes.OnDeleteAnalyticsSubscription
>;
export const onDeleteBadge = /* GraphQL */ `subscription OnDeleteBadge($filter: ModelSubscriptionBadgeFilterInput) {
  onDeleteBadge(filter: $filter) {
    createdAt
    criteria
    description
    earnedAt
    icon
    id
    name
    type
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteBadgeSubscriptionVariables,
  APITypes.OnDeleteBadgeSubscription
>;
export const onDeleteHotel = /* GraphQL */ `subscription OnDeleteHotel($filter: ModelSubscriptionHotelFilterInput) {
  onDeleteHotel(filter: $filter) {
    address
    analyticsEntries {
      nextToken
      __typename
    }
    createdAt
    id
    name
    ratings {
      nextToken
      __typename
    }
    shifts {
      nextToken
      __typename
    }
    timezone
    updatedAt
    users {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteHotelSubscriptionVariables,
  APITypes.OnDeleteHotelSubscription
>;
export const onDeleteQRCode = /* GraphQL */ `subscription OnDeleteQRCode($filter: ModelSubscriptionQRCodeFilterInput) {
  onDeleteQRCode(filter: $filter) {
    createdAt
    expiresAt
    id
    isUsed
    shift {
      averageRating
      createdAt
      endTime
      hotelId
      id
      isActive
      pointsEarned
      ratingsCount
      startTime
      totalTips
      updatedAt
      waiterId
      __typename
    }
    shiftId
    token
    updatedAt
    url
    usedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteQRCodeSubscriptionVariables,
  APITypes.OnDeleteQRCodeSubscription
>;
export const onDeleteRating = /* GraphQL */ `subscription OnDeleteRating($filter: ModelSubscriptionRatingFilterInput) {
  onDeleteRating(filter: $filter) {
    ambianceRating
    comment
    createdAt
    deviceInfo
    flaggedReason
    foodRating
    guestName
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isFlagged
    isResolved
    qrToken
    rating
    resolutionNotes
    resolvedAt
    resolvedBy
    serviceRating
    tableNumber
    timestamp
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRatingSubscriptionVariables,
  APITypes.OnDeleteRatingSubscription
>;
export const onDeleteShift = /* GraphQL */ `subscription OnDeleteShift($filter: ModelSubscriptionShiftFilterInput) {
  onDeleteShift(filter: $filter) {
    averageRating
    createdAt
    endTime
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isActive
    pointsEarned
    qrCodes {
      nextToken
      __typename
    }
    ratingsCount
    startTime
    totalTips
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteShiftSubscriptionVariables,
  APITypes.OnDeleteShiftSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
    averageRating
    badges {
      nextToken
      __typename
    }
    createdAt
    email
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isActive
    level
    name
    points
    qrCodes {
      nextToken
      __typename
    }
    ratings {
      nextToken
      __typename
    }
    role
    shifts {
      nextToken
      __typename
    }
    totalRatings
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onUpdateAnalytics = /* GraphQL */ `subscription OnUpdateAnalytics($filter: ModelSubscriptionAnalyticsFilterInput) {
  onUpdateAnalytics(filter: $filter) {
    activeWaiters
    averageRating
    createdAt
    date
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    metrics
    period
    topWaiterId
    totalPoints
    totalRatings
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAnalyticsSubscriptionVariables,
  APITypes.OnUpdateAnalyticsSubscription
>;
export const onUpdateBadge = /* GraphQL */ `subscription OnUpdateBadge($filter: ModelSubscriptionBadgeFilterInput) {
  onUpdateBadge(filter: $filter) {
    createdAt
    criteria
    description
    earnedAt
    icon
    id
    name
    type
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateBadgeSubscriptionVariables,
  APITypes.OnUpdateBadgeSubscription
>;
export const onUpdateHotel = /* GraphQL */ `subscription OnUpdateHotel($filter: ModelSubscriptionHotelFilterInput) {
  onUpdateHotel(filter: $filter) {
    address
    analyticsEntries {
      nextToken
      __typename
    }
    createdAt
    id
    name
    ratings {
      nextToken
      __typename
    }
    shifts {
      nextToken
      __typename
    }
    timezone
    updatedAt
    users {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateHotelSubscriptionVariables,
  APITypes.OnUpdateHotelSubscription
>;
export const onUpdateQRCode = /* GraphQL */ `subscription OnUpdateQRCode($filter: ModelSubscriptionQRCodeFilterInput) {
  onUpdateQRCode(filter: $filter) {
    createdAt
    expiresAt
    id
    isUsed
    shift {
      averageRating
      createdAt
      endTime
      hotelId
      id
      isActive
      pointsEarned
      ratingsCount
      startTime
      totalTips
      updatedAt
      waiterId
      __typename
    }
    shiftId
    token
    updatedAt
    url
    usedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateQRCodeSubscriptionVariables,
  APITypes.OnUpdateQRCodeSubscription
>;
export const onUpdateRating = /* GraphQL */ `subscription OnUpdateRating($filter: ModelSubscriptionRatingFilterInput) {
  onUpdateRating(filter: $filter) {
    ambianceRating
    comment
    createdAt
    deviceInfo
    flaggedReason
    foodRating
    guestName
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isFlagged
    isResolved
    qrToken
    rating
    resolutionNotes
    resolvedAt
    resolvedBy
    serviceRating
    tableNumber
    timestamp
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRatingSubscriptionVariables,
  APITypes.OnUpdateRatingSubscription
>;
export const onUpdateShift = /* GraphQL */ `subscription OnUpdateShift($filter: ModelSubscriptionShiftFilterInput) {
  onUpdateShift(filter: $filter) {
    averageRating
    createdAt
    endTime
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isActive
    pointsEarned
    qrCodes {
      nextToken
      __typename
    }
    ratingsCount
    startTime
    totalTips
    updatedAt
    waiter {
      averageRating
      createdAt
      email
      hotelId
      id
      isActive
      level
      name
      points
      role
      totalRatings
      updatedAt
      __typename
    }
    waiterId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateShiftSubscriptionVariables,
  APITypes.OnUpdateShiftSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    averageRating
    badges {
      nextToken
      __typename
    }
    createdAt
    email
    hotel {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    hotelId
    id
    isActive
    level
    name
    points
    qrCodes {
      nextToken
      __typename
    }
    ratings {
      nextToken
      __typename
    }
    role
    shifts {
      nextToken
      __typename
    }
    totalRatings
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
