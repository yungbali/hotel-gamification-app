/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAnalytics = /* GraphQL */ `query GetAnalytics($id: ID!) {
  getAnalytics(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAnalyticsQueryVariables,
  APITypes.GetAnalyticsQuery
>;
export const getBadge = /* GraphQL */ `query GetBadge($id: ID!) {
  getBadge(id: $id) {
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
` as GeneratedQuery<APITypes.GetBadgeQueryVariables, APITypes.GetBadgeQuery>;
export const getHotel = /* GraphQL */ `query GetHotel($id: ID!) {
  getHotel(id: $id) {
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
` as GeneratedQuery<APITypes.GetHotelQueryVariables, APITypes.GetHotelQuery>;
export const getQRCode = /* GraphQL */ `query GetQRCode($id: ID!) {
  getQRCode(id: $id) {
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
` as GeneratedQuery<APITypes.GetQRCodeQueryVariables, APITypes.GetQRCodeQuery>;
export const getRating = /* GraphQL */ `query GetRating($id: ID!) {
  getRating(id: $id) {
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
` as GeneratedQuery<APITypes.GetRatingQueryVariables, APITypes.GetRatingQuery>;
export const getShift = /* GraphQL */ `query GetShift($id: ID!) {
  getShift(id: $id) {
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
` as GeneratedQuery<APITypes.GetShiftQueryVariables, APITypes.GetShiftQuery>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listAnalytics = /* GraphQL */ `query ListAnalytics(
  $filter: ModelAnalyticsFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      activeWaiters
      averageRating
      createdAt
      date
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalyticsQueryVariables,
  APITypes.ListAnalyticsQuery
>;
export const listBadges = /* GraphQL */ `query ListBadges(
  $filter: ModelBadgeFilterInput
  $limit: Int
  $nextToken: String
) {
  listBadges(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      criteria
      description
      earnedAt
      icon
      id
      name
      type
      updatedAt
      waiterId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBadgesQueryVariables,
  APITypes.ListBadgesQuery
>;
export const listHotels = /* GraphQL */ `query ListHotels(
  $filter: ModelHotelFilterInput
  $limit: Int
  $nextToken: String
) {
  listHotels(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      address
      createdAt
      id
      name
      timezone
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListHotelsQueryVariables,
  APITypes.ListHotelsQuery
>;
export const listQRCodes = /* GraphQL */ `query ListQRCodes(
  $filter: ModelQRCodeFilterInput
  $limit: Int
  $nextToken: String
) {
  listQRCodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      expiresAt
      id
      isUsed
      shiftId
      token
      updatedAt
      url
      usedAt
      waiterId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListQRCodesQueryVariables,
  APITypes.ListQRCodesQuery
>;
export const listRatings = /* GraphQL */ `query ListRatings(
  $filter: ModelRatingFilterInput
  $limit: Int
  $nextToken: String
) {
  listRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ambianceRating
      comment
      createdAt
      deviceInfo
      flaggedReason
      foodRating
      guestName
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
      waiterId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRatingsQueryVariables,
  APITypes.ListRatingsQuery
>;
export const listShifts = /* GraphQL */ `query ListShifts(
  $filter: ModelShiftFilterInput
  $limit: Int
  $nextToken: String
) {
  listShifts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftsQueryVariables,
  APITypes.ListShiftsQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
