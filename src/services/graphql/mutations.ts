/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAnalytics = /* GraphQL */ `mutation CreateAnalytics(
  $condition: ModelAnalyticsConditionInput
  $input: CreateAnalyticsInput!
) {
  createAnalytics(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAnalyticsMutationVariables,
  APITypes.CreateAnalyticsMutation
>;
export const createBadge = /* GraphQL */ `mutation CreateBadge(
  $condition: ModelBadgeConditionInput
  $input: CreateBadgeInput!
) {
  createBadge(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBadgeMutationVariables,
  APITypes.CreateBadgeMutation
>;
export const createHotel = /* GraphQL */ `mutation CreateHotel(
  $condition: ModelHotelConditionInput
  $input: CreateHotelInput!
) {
  createHotel(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateHotelMutationVariables,
  APITypes.CreateHotelMutation
>;
export const createQRCode = /* GraphQL */ `mutation CreateQRCode(
  $condition: ModelQRCodeConditionInput
  $input: CreateQRCodeInput!
) {
  createQRCode(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateQRCodeMutationVariables,
  APITypes.CreateQRCodeMutation
>;
export const createRating = /* GraphQL */ `mutation CreateRating(
  $condition: ModelRatingConditionInput
  $input: CreateRatingInput!
) {
  createRating(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateRatingMutationVariables,
  APITypes.CreateRatingMutation
>;
export const createShift = /* GraphQL */ `mutation CreateShift(
  $condition: ModelShiftConditionInput
  $input: CreateShiftInput!
) {
  createShift(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateShiftMutationVariables,
  APITypes.CreateShiftMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const deleteAnalytics = /* GraphQL */ `mutation DeleteAnalytics(
  $condition: ModelAnalyticsConditionInput
  $input: DeleteAnalyticsInput!
) {
  deleteAnalytics(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAnalyticsMutationVariables,
  APITypes.DeleteAnalyticsMutation
>;
export const deleteBadge = /* GraphQL */ `mutation DeleteBadge(
  $condition: ModelBadgeConditionInput
  $input: DeleteBadgeInput!
) {
  deleteBadge(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteBadgeMutationVariables,
  APITypes.DeleteBadgeMutation
>;
export const deleteHotel = /* GraphQL */ `mutation DeleteHotel(
  $condition: ModelHotelConditionInput
  $input: DeleteHotelInput!
) {
  deleteHotel(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteHotelMutationVariables,
  APITypes.DeleteHotelMutation
>;
export const deleteQRCode = /* GraphQL */ `mutation DeleteQRCode(
  $condition: ModelQRCodeConditionInput
  $input: DeleteQRCodeInput!
) {
  deleteQRCode(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteQRCodeMutationVariables,
  APITypes.DeleteQRCodeMutation
>;
export const deleteRating = /* GraphQL */ `mutation DeleteRating(
  $condition: ModelRatingConditionInput
  $input: DeleteRatingInput!
) {
  deleteRating(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteRatingMutationVariables,
  APITypes.DeleteRatingMutation
>;
export const deleteShift = /* GraphQL */ `mutation DeleteShift(
  $condition: ModelShiftConditionInput
  $input: DeleteShiftInput!
) {
  deleteShift(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteShiftMutationVariables,
  APITypes.DeleteShiftMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const updateAnalytics = /* GraphQL */ `mutation UpdateAnalytics(
  $condition: ModelAnalyticsConditionInput
  $input: UpdateAnalyticsInput!
) {
  updateAnalytics(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAnalyticsMutationVariables,
  APITypes.UpdateAnalyticsMutation
>;
export const updateBadge = /* GraphQL */ `mutation UpdateBadge(
  $condition: ModelBadgeConditionInput
  $input: UpdateBadgeInput!
) {
  updateBadge(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBadgeMutationVariables,
  APITypes.UpdateBadgeMutation
>;
export const updateHotel = /* GraphQL */ `mutation UpdateHotel(
  $condition: ModelHotelConditionInput
  $input: UpdateHotelInput!
) {
  updateHotel(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateHotelMutationVariables,
  APITypes.UpdateHotelMutation
>;
export const updateQRCode = /* GraphQL */ `mutation UpdateQRCode(
  $condition: ModelQRCodeConditionInput
  $input: UpdateQRCodeInput!
) {
  updateQRCode(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateQRCodeMutationVariables,
  APITypes.UpdateQRCodeMutation
>;
export const updateRating = /* GraphQL */ `mutation UpdateRating(
  $condition: ModelRatingConditionInput
  $input: UpdateRatingInput!
) {
  updateRating(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateRatingMutationVariables,
  APITypes.UpdateRatingMutation
>;
export const updateShift = /* GraphQL */ `mutation UpdateShift(
  $condition: ModelShiftConditionInput
  $input: UpdateShiftInput!
) {
  updateShift(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateShiftMutationVariables,
  APITypes.UpdateShiftMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
