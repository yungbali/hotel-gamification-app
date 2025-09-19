/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Analytics = {
  __typename: "Analytics",
  activeWaiters?: number | null,
  averageRating?: number | null,
  createdAt: string,
  date: string,
  hotel?: Hotel | null,
  hotelId: string,
  id: string,
  metrics?: string | null,
  period?: AnalyticsPeriod | null,
  topWaiterId?: string | null,
  totalPoints?: number | null,
  totalRatings?: number | null,
  updatedAt: string,
};

export type Hotel = {
  __typename: "Hotel",
  address?: string | null,
  analyticsEntries?: ModelAnalyticsConnection | null,
  createdAt?: string | null,
  id: string,
  name: string,
  ratings?: ModelRatingConnection | null,
  shifts?: ModelShiftConnection | null,
  timezone?: string | null,
  updatedAt?: string | null,
  users?: ModelUserConnection | null,
};

export type ModelAnalyticsConnection = {
  __typename: "ModelAnalyticsConnection",
  items:  Array<Analytics | null >,
  nextToken?: string | null,
};

export type ModelRatingConnection = {
  __typename: "ModelRatingConnection",
  items:  Array<Rating | null >,
  nextToken?: string | null,
};

export type Rating = {
  __typename: "Rating",
  ambianceRating?: number | null,
  comment?: string | null,
  createdAt: string,
  deviceInfo?: string | null,
  flaggedReason?: string | null,
  foodRating?: number | null,
  guestName?: string | null,
  hotel?: Hotel | null,
  hotelId: string,
  id: string,
  isFlagged?: boolean | null,
  isResolved?: boolean | null,
  qrToken?: string | null,
  rating: number,
  resolutionNotes?: string | null,
  resolvedAt?: string | null,
  resolvedBy?: string | null,
  serviceRating?: number | null,
  tableNumber?: string | null,
  timestamp: string,
  updatedAt: string,
  waiter?: User | null,
  waiterId: string,
};

export type User = {
  __typename: "User",
  averageRating?: number | null,
  badges?: ModelBadgeConnection | null,
  createdAt?: string | null,
  email: string,
  hotel?: Hotel | null,
  hotelId?: string | null,
  id: string,
  isActive?: boolean | null,
  level?: number | null,
  name: string,
  points?: number | null,
  qrCodes?: ModelQRCodeConnection | null,
  ratings?: ModelRatingConnection | null,
  role?: UserRole | null,
  shifts?: ModelShiftConnection | null,
  totalRatings?: number | null,
  updatedAt?: string | null,
};

export type ModelBadgeConnection = {
  __typename: "ModelBadgeConnection",
  items:  Array<Badge | null >,
  nextToken?: string | null,
};

export type Badge = {
  __typename: "Badge",
  createdAt: string,
  criteria?: string | null,
  description?: string | null,
  earnedAt: string,
  icon?: string | null,
  id: string,
  name: string,
  type?: BadgeType | null,
  updatedAt: string,
  waiter?: User | null,
  waiterId: string,
};

export enum BadgeType {
  customer_favorite = "customer_favorite",
  efficiency_expert = "efficiency_expert",
  rising_star = "rising_star",
  service_star = "service_star",
  team_player = "team_player",
}


export type ModelQRCodeConnection = {
  __typename: "ModelQRCodeConnection",
  items:  Array<QRCode | null >,
  nextToken?: string | null,
};

export type QRCode = {
  __typename: "QRCode",
  createdAt?: string | null,
  expiresAt: string,
  id: string,
  isUsed?: boolean | null,
  shift?: Shift | null,
  shiftId: string,
  token: string,
  updatedAt: string,
  url: string,
  usedAt?: string | null,
  waiter?: User | null,
  waiterId: string,
};

export type Shift = {
  __typename: "Shift",
  averageRating?: number | null,
  createdAt: string,
  endTime?: string | null,
  hotel?: Hotel | null,
  hotelId: string,
  id: string,
  isActive?: boolean | null,
  pointsEarned?: number | null,
  qrCodes?: ModelQRCodeConnection | null,
  ratingsCount?: number | null,
  startTime: string,
  totalTips?: number | null,
  updatedAt: string,
  waiter?: User | null,
  waiterId: string,
};

export enum UserRole {
  admin = "admin",
  manager = "manager",
  waiter = "waiter",
}


export type ModelShiftConnection = {
  __typename: "ModelShiftConnection",
  items:  Array<Shift | null >,
  nextToken?: string | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export enum AnalyticsPeriod {
  daily = "daily",
  monthly = "monthly",
  weekly = "weekly",
}


export type ModelAnalyticsFilterInput = {
  activeWaiters?: ModelIntInput | null,
  and?: Array< ModelAnalyticsFilterInput | null > | null,
  averageRating?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  metrics?: ModelStringInput | null,
  not?: ModelAnalyticsFilterInput | null,
  or?: Array< ModelAnalyticsFilterInput | null > | null,
  period?: ModelAnalyticsPeriodInput | null,
  topWaiterId?: ModelIDInput | null,
  totalPoints?: ModelIntInput | null,
  totalRatings?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelAnalyticsPeriodInput = {
  eq?: AnalyticsPeriod | null,
  ne?: AnalyticsPeriod | null,
};

export type ModelBadgeFilterInput = {
  and?: Array< ModelBadgeFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  criteria?: ModelStringInput | null,
  description?: ModelStringInput | null,
  earnedAt?: ModelStringInput | null,
  icon?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelBadgeFilterInput | null,
  or?: Array< ModelBadgeFilterInput | null > | null,
  type?: ModelBadgeTypeInput | null,
  updatedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type ModelBadgeTypeInput = {
  eq?: BadgeType | null,
  ne?: BadgeType | null,
};

export type ModelHotelFilterInput = {
  address?: ModelStringInput | null,
  and?: Array< ModelHotelFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelHotelFilterInput | null,
  or?: Array< ModelHotelFilterInput | null > | null,
  timezone?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelHotelConnection = {
  __typename: "ModelHotelConnection",
  items:  Array<Hotel | null >,
  nextToken?: string | null,
};

export type ModelQRCodeFilterInput = {
  and?: Array< ModelQRCodeFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  expiresAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isUsed?: ModelBooleanInput | null,
  not?: ModelQRCodeFilterInput | null,
  or?: Array< ModelQRCodeFilterInput | null > | null,
  shiftId?: ModelIDInput | null,
  token?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  url?: ModelStringInput | null,
  usedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelRatingFilterInput = {
  ambianceRating?: ModelIntInput | null,
  and?: Array< ModelRatingFilterInput | null > | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  deviceInfo?: ModelStringInput | null,
  flaggedReason?: ModelStringInput | null,
  foodRating?: ModelIntInput | null,
  guestName?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  isFlagged?: ModelBooleanInput | null,
  isResolved?: ModelBooleanInput | null,
  not?: ModelRatingFilterInput | null,
  or?: Array< ModelRatingFilterInput | null > | null,
  qrToken?: ModelStringInput | null,
  rating?: ModelIntInput | null,
  resolutionNotes?: ModelStringInput | null,
  resolvedAt?: ModelStringInput | null,
  resolvedBy?: ModelIDInput | null,
  serviceRating?: ModelIntInput | null,
  tableNumber?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type ModelShiftFilterInput = {
  and?: Array< ModelShiftFilterInput | null > | null,
  averageRating?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  not?: ModelShiftFilterInput | null,
  or?: Array< ModelShiftFilterInput | null > | null,
  pointsEarned?: ModelIntInput | null,
  ratingsCount?: ModelIntInput | null,
  startTime?: ModelStringInput | null,
  totalTips?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type ModelUserFilterInput = {
  and?: Array< ModelUserFilterInput | null > | null,
  averageRating?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  level?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  points?: ModelIntInput | null,
  role?: ModelUserRoleInput | null,
  totalRatings?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type ModelAnalyticsConditionInput = {
  activeWaiters?: ModelIntInput | null,
  and?: Array< ModelAnalyticsConditionInput | null > | null,
  averageRating?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  metrics?: ModelStringInput | null,
  not?: ModelAnalyticsConditionInput | null,
  or?: Array< ModelAnalyticsConditionInput | null > | null,
  period?: ModelAnalyticsPeriodInput | null,
  topWaiterId?: ModelIDInput | null,
  totalPoints?: ModelIntInput | null,
  totalRatings?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAnalyticsInput = {
  activeWaiters?: number | null,
  averageRating?: number | null,
  date: string,
  hotelId: string,
  id?: string | null,
  metrics?: string | null,
  period?: AnalyticsPeriod | null,
  topWaiterId?: string | null,
  totalPoints?: number | null,
  totalRatings?: number | null,
};

export type ModelBadgeConditionInput = {
  and?: Array< ModelBadgeConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  criteria?: ModelStringInput | null,
  description?: ModelStringInput | null,
  earnedAt?: ModelStringInput | null,
  icon?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelBadgeConditionInput | null,
  or?: Array< ModelBadgeConditionInput | null > | null,
  type?: ModelBadgeTypeInput | null,
  updatedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type CreateBadgeInput = {
  criteria?: string | null,
  description?: string | null,
  earnedAt: string,
  icon?: string | null,
  id?: string | null,
  name: string,
  type?: BadgeType | null,
  waiterId: string,
};

export type ModelHotelConditionInput = {
  address?: ModelStringInput | null,
  and?: Array< ModelHotelConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelHotelConditionInput | null,
  or?: Array< ModelHotelConditionInput | null > | null,
  timezone?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateHotelInput = {
  address?: string | null,
  createdAt?: string | null,
  id?: string | null,
  name: string,
  timezone?: string | null,
  updatedAt?: string | null,
};

export type ModelQRCodeConditionInput = {
  and?: Array< ModelQRCodeConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  expiresAt?: ModelStringInput | null,
  isUsed?: ModelBooleanInput | null,
  not?: ModelQRCodeConditionInput | null,
  or?: Array< ModelQRCodeConditionInput | null > | null,
  shiftId?: ModelIDInput | null,
  token?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  url?: ModelStringInput | null,
  usedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type CreateQRCodeInput = {
  createdAt?: string | null,
  expiresAt: string,
  id?: string | null,
  isUsed?: boolean | null,
  shiftId: string,
  token: string,
  url: string,
  usedAt?: string | null,
  waiterId: string,
};

export type ModelRatingConditionInput = {
  ambianceRating?: ModelIntInput | null,
  and?: Array< ModelRatingConditionInput | null > | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  deviceInfo?: ModelStringInput | null,
  flaggedReason?: ModelStringInput | null,
  foodRating?: ModelIntInput | null,
  guestName?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  isFlagged?: ModelBooleanInput | null,
  isResolved?: ModelBooleanInput | null,
  not?: ModelRatingConditionInput | null,
  or?: Array< ModelRatingConditionInput | null > | null,
  qrToken?: ModelStringInput | null,
  rating?: ModelIntInput | null,
  resolutionNotes?: ModelStringInput | null,
  resolvedAt?: ModelStringInput | null,
  resolvedBy?: ModelIDInput | null,
  serviceRating?: ModelIntInput | null,
  tableNumber?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type CreateRatingInput = {
  ambianceRating?: number | null,
  comment?: string | null,
  deviceInfo?: string | null,
  flaggedReason?: string | null,
  foodRating?: number | null,
  guestName?: string | null,
  hotelId: string,
  id?: string | null,
  isFlagged?: boolean | null,
  isResolved?: boolean | null,
  qrToken?: string | null,
  rating: number,
  resolutionNotes?: string | null,
  resolvedAt?: string | null,
  resolvedBy?: string | null,
  serviceRating?: number | null,
  tableNumber?: string | null,
  timestamp: string,
  waiterId: string,
};

export type ModelShiftConditionInput = {
  and?: Array< ModelShiftConditionInput | null > | null,
  averageRating?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  not?: ModelShiftConditionInput | null,
  or?: Array< ModelShiftConditionInput | null > | null,
  pointsEarned?: ModelIntInput | null,
  ratingsCount?: ModelIntInput | null,
  startTime?: ModelStringInput | null,
  totalTips?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
  waiterId?: ModelIDInput | null,
};

export type CreateShiftInput = {
  averageRating?: number | null,
  endTime?: string | null,
  hotelId: string,
  id?: string | null,
  isActive?: boolean | null,
  pointsEarned?: number | null,
  ratingsCount?: number | null,
  startTime: string,
  totalTips?: number | null,
  waiterId: string,
};

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  averageRating?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  hotelId?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  level?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  points?: ModelIntInput | null,
  role?: ModelUserRoleInput | null,
  totalRatings?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  averageRating?: number | null,
  createdAt?: string | null,
  email: string,
  hotelId?: string | null,
  id?: string | null,
  isActive?: boolean | null,
  level?: number | null,
  name: string,
  points?: number | null,
  role?: UserRole | null,
  totalRatings?: number | null,
  updatedAt?: string | null,
};

export type DeleteAnalyticsInput = {
  id: string,
};

export type DeleteBadgeInput = {
  id: string,
};

export type DeleteHotelInput = {
  id: string,
};

export type DeleteQRCodeInput = {
  id: string,
};

export type DeleteRatingInput = {
  id: string,
};

export type DeleteShiftInput = {
  id: string,
};

export type DeleteUserInput = {
  id: string,
};

export type UpdateAnalyticsInput = {
  activeWaiters?: number | null,
  averageRating?: number | null,
  date?: string | null,
  hotelId?: string | null,
  id: string,
  metrics?: string | null,
  period?: AnalyticsPeriod | null,
  topWaiterId?: string | null,
  totalPoints?: number | null,
  totalRatings?: number | null,
};

export type UpdateBadgeInput = {
  criteria?: string | null,
  description?: string | null,
  earnedAt?: string | null,
  icon?: string | null,
  id: string,
  name?: string | null,
  type?: BadgeType | null,
  waiterId?: string | null,
};

export type UpdateHotelInput = {
  address?: string | null,
  createdAt?: string | null,
  id: string,
  name?: string | null,
  timezone?: string | null,
  updatedAt?: string | null,
};

export type UpdateQRCodeInput = {
  createdAt?: string | null,
  expiresAt?: string | null,
  id: string,
  isUsed?: boolean | null,
  shiftId?: string | null,
  token?: string | null,
  url?: string | null,
  usedAt?: string | null,
  waiterId?: string | null,
};

export type UpdateRatingInput = {
  ambianceRating?: number | null,
  comment?: string | null,
  deviceInfo?: string | null,
  flaggedReason?: string | null,
  foodRating?: number | null,
  guestName?: string | null,
  hotelId?: string | null,
  id: string,
  isFlagged?: boolean | null,
  isResolved?: boolean | null,
  qrToken?: string | null,
  rating?: number | null,
  resolutionNotes?: string | null,
  resolvedAt?: string | null,
  resolvedBy?: string | null,
  serviceRating?: number | null,
  tableNumber?: string | null,
  timestamp?: string | null,
  waiterId?: string | null,
};

export type UpdateShiftInput = {
  averageRating?: number | null,
  endTime?: string | null,
  hotelId?: string | null,
  id: string,
  isActive?: boolean | null,
  pointsEarned?: number | null,
  ratingsCount?: number | null,
  startTime?: string | null,
  totalTips?: number | null,
  waiterId?: string | null,
};

export type UpdateUserInput = {
  averageRating?: number | null,
  createdAt?: string | null,
  email?: string | null,
  hotelId?: string | null,
  id: string,
  isActive?: boolean | null,
  level?: number | null,
  name?: string | null,
  points?: number | null,
  role?: UserRole | null,
  totalRatings?: number | null,
  updatedAt?: string | null,
};

export type ModelSubscriptionAnalyticsFilterInput = {
  activeWaiters?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionAnalyticsFilterInput | null > | null,
  averageRating?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  hotelId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  metrics?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAnalyticsFilterInput | null > | null,
  period?: ModelSubscriptionStringInput | null,
  topWaiterId?: ModelSubscriptionIDInput | null,
  totalPoints?: ModelSubscriptionIntInput | null,
  totalRatings?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBadgeFilterInput = {
  and?: Array< ModelSubscriptionBadgeFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  criteria?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  earnedAt?: ModelSubscriptionStringInput | null,
  icon?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionBadgeFilterInput | null > | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  waiterId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionHotelFilterInput = {
  address?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionHotelFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionHotelFilterInput | null > | null,
  timezone?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionQRCodeFilterInput = {
  and?: Array< ModelSubscriptionQRCodeFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  expiresAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isUsed?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionQRCodeFilterInput | null > | null,
  shiftId?: ModelSubscriptionIDInput | null,
  token?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  url?: ModelSubscriptionStringInput | null,
  usedAt?: ModelSubscriptionStringInput | null,
  waiterId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionRatingFilterInput = {
  ambianceRating?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionRatingFilterInput | null > | null,
  comment?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  deviceInfo?: ModelSubscriptionStringInput | null,
  flaggedReason?: ModelSubscriptionStringInput | null,
  foodRating?: ModelSubscriptionIntInput | null,
  guestName?: ModelSubscriptionStringInput | null,
  hotelId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  isFlagged?: ModelSubscriptionBooleanInput | null,
  isResolved?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionRatingFilterInput | null > | null,
  qrToken?: ModelSubscriptionStringInput | null,
  rating?: ModelSubscriptionIntInput | null,
  resolutionNotes?: ModelSubscriptionStringInput | null,
  resolvedAt?: ModelSubscriptionStringInput | null,
  resolvedBy?: ModelSubscriptionIDInput | null,
  serviceRating?: ModelSubscriptionIntInput | null,
  tableNumber?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  waiterId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionShiftFilterInput = {
  and?: Array< ModelSubscriptionShiftFilterInput | null > | null,
  averageRating?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  endTime?: ModelSubscriptionStringInput | null,
  hotelId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionShiftFilterInput | null > | null,
  pointsEarned?: ModelSubscriptionIntInput | null,
  ratingsCount?: ModelSubscriptionIntInput | null,
  startTime?: ModelSubscriptionStringInput | null,
  totalTips?: ModelSubscriptionFloatInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  waiterId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  averageRating?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  hotelId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  level?: ModelSubscriptionIntInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  points?: ModelSubscriptionIntInput | null,
  role?: ModelSubscriptionStringInput | null,
  totalRatings?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetAnalyticsQueryVariables = {
  id: string,
};

export type GetAnalyticsQuery = {
  getAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type GetBadgeQueryVariables = {
  id: string,
};

export type GetBadgeQuery = {
  getBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type GetHotelQueryVariables = {
  id: string,
};

export type GetHotelQuery = {
  getHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetQRCodeQueryVariables = {
  id: string,
};

export type GetQRCodeQuery = {
  getQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type GetRatingQueryVariables = {
  id: string,
};

export type GetRatingQuery = {
  getRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type GetShiftQueryVariables = {
  id: string,
};

export type GetShiftQuery = {
  getShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};

export type ListAnalyticsQueryVariables = {
  filter?: ModelAnalyticsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAnalyticsQuery = {
  listAnalytics?:  {
    __typename: "ModelAnalyticsConnection",
    items:  Array< {
      __typename: "Analytics",
      activeWaiters?: number | null,
      averageRating?: number | null,
      createdAt: string,
      date: string,
      hotelId: string,
      id: string,
      metrics?: string | null,
      period?: AnalyticsPeriod | null,
      topWaiterId?: string | null,
      totalPoints?: number | null,
      totalRatings?: number | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListBadgesQueryVariables = {
  filter?: ModelBadgeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBadgesQuery = {
  listBadges?:  {
    __typename: "ModelBadgeConnection",
    items:  Array< {
      __typename: "Badge",
      createdAt: string,
      criteria?: string | null,
      description?: string | null,
      earnedAt: string,
      icon?: string | null,
      id: string,
      name: string,
      type?: BadgeType | null,
      updatedAt: string,
      waiterId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListHotelsQueryVariables = {
  filter?: ModelHotelFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListHotelsQuery = {
  listHotels?:  {
    __typename: "ModelHotelConnection",
    items:  Array< {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListQRCodesQueryVariables = {
  filter?: ModelQRCodeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQRCodesQuery = {
  listQRCodes?:  {
    __typename: "ModelQRCodeConnection",
    items:  Array< {
      __typename: "QRCode",
      createdAt?: string | null,
      expiresAt: string,
      id: string,
      isUsed?: boolean | null,
      shiftId: string,
      token: string,
      updatedAt: string,
      url: string,
      usedAt?: string | null,
      waiterId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListRatingsQueryVariables = {
  filter?: ModelRatingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRatingsQuery = {
  listRatings?:  {
    __typename: "ModelRatingConnection",
    items:  Array< {
      __typename: "Rating",
      ambianceRating?: number | null,
      comment?: string | null,
      createdAt: string,
      deviceInfo?: string | null,
      flaggedReason?: string | null,
      foodRating?: number | null,
      guestName?: string | null,
      hotelId: string,
      id: string,
      isFlagged?: boolean | null,
      isResolved?: boolean | null,
      qrToken?: string | null,
      rating: number,
      resolutionNotes?: string | null,
      resolvedAt?: string | null,
      resolvedBy?: string | null,
      serviceRating?: number | null,
      tableNumber?: string | null,
      timestamp: string,
      updatedAt: string,
      waiterId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListShiftsQueryVariables = {
  filter?: ModelShiftFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShiftsQuery = {
  listShifts?:  {
    __typename: "ModelShiftConnection",
    items:  Array< {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateAnalyticsMutationVariables = {
  condition?: ModelAnalyticsConditionInput | null,
  input: CreateAnalyticsInput,
};

export type CreateAnalyticsMutation = {
  createAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type CreateBadgeMutationVariables = {
  condition?: ModelBadgeConditionInput | null,
  input: CreateBadgeInput,
};

export type CreateBadgeMutation = {
  createBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type CreateHotelMutationVariables = {
  condition?: ModelHotelConditionInput | null,
  input: CreateHotelInput,
};

export type CreateHotelMutation = {
  createHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateQRCodeMutationVariables = {
  condition?: ModelQRCodeConditionInput | null,
  input: CreateQRCodeInput,
};

export type CreateQRCodeMutation = {
  createQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type CreateRatingMutationVariables = {
  condition?: ModelRatingConditionInput | null,
  input: CreateRatingInput,
};

export type CreateRatingMutation = {
  createRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type CreateShiftMutationVariables = {
  condition?: ModelShiftConditionInput | null,
  input: CreateShiftInput,
};

export type CreateShiftMutation = {
  createShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteAnalyticsMutationVariables = {
  condition?: ModelAnalyticsConditionInput | null,
  input: DeleteAnalyticsInput,
};

export type DeleteAnalyticsMutation = {
  deleteAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type DeleteBadgeMutationVariables = {
  condition?: ModelBadgeConditionInput | null,
  input: DeleteBadgeInput,
};

export type DeleteBadgeMutation = {
  deleteBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type DeleteHotelMutationVariables = {
  condition?: ModelHotelConditionInput | null,
  input: DeleteHotelInput,
};

export type DeleteHotelMutation = {
  deleteHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteQRCodeMutationVariables = {
  condition?: ModelQRCodeConditionInput | null,
  input: DeleteQRCodeInput,
};

export type DeleteQRCodeMutation = {
  deleteQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type DeleteRatingMutationVariables = {
  condition?: ModelRatingConditionInput | null,
  input: DeleteRatingInput,
};

export type DeleteRatingMutation = {
  deleteRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type DeleteShiftMutationVariables = {
  condition?: ModelShiftConditionInput | null,
  input: DeleteShiftInput,
};

export type DeleteShiftMutation = {
  deleteShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateAnalyticsMutationVariables = {
  condition?: ModelAnalyticsConditionInput | null,
  input: UpdateAnalyticsInput,
};

export type UpdateAnalyticsMutation = {
  updateAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type UpdateBadgeMutationVariables = {
  condition?: ModelBadgeConditionInput | null,
  input: UpdateBadgeInput,
};

export type UpdateBadgeMutation = {
  updateBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type UpdateHotelMutationVariables = {
  condition?: ModelHotelConditionInput | null,
  input: UpdateHotelInput,
};

export type UpdateHotelMutation = {
  updateHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateQRCodeMutationVariables = {
  condition?: ModelQRCodeConditionInput | null,
  input: UpdateQRCodeInput,
};

export type UpdateQRCodeMutation = {
  updateQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type UpdateRatingMutationVariables = {
  condition?: ModelRatingConditionInput | null,
  input: UpdateRatingInput,
};

export type UpdateRatingMutation = {
  updateRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type UpdateShiftMutationVariables = {
  condition?: ModelShiftConditionInput | null,
  input: UpdateShiftInput,
};

export type UpdateShiftMutation = {
  updateShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
};

export type OnCreateAnalyticsSubscription = {
  onCreateAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type OnCreateBadgeSubscriptionVariables = {
  filter?: ModelSubscriptionBadgeFilterInput | null,
};

export type OnCreateBadgeSubscription = {
  onCreateBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnCreateHotelSubscriptionVariables = {
  filter?: ModelSubscriptionHotelFilterInput | null,
};

export type OnCreateHotelSubscription = {
  onCreateHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateQRCodeSubscriptionVariables = {
  filter?: ModelSubscriptionQRCodeFilterInput | null,
};

export type OnCreateQRCodeSubscription = {
  onCreateQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnCreateRatingSubscriptionVariables = {
  filter?: ModelSubscriptionRatingFilterInput | null,
};

export type OnCreateRatingSubscription = {
  onCreateRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnCreateShiftSubscriptionVariables = {
  filter?: ModelSubscriptionShiftFilterInput | null,
};

export type OnCreateShiftSubscription = {
  onCreateShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
};

export type OnDeleteAnalyticsSubscription = {
  onDeleteAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteBadgeSubscriptionVariables = {
  filter?: ModelSubscriptionBadgeFilterInput | null,
};

export type OnDeleteBadgeSubscription = {
  onDeleteBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnDeleteHotelSubscriptionVariables = {
  filter?: ModelSubscriptionHotelFilterInput | null,
};

export type OnDeleteHotelSubscription = {
  onDeleteHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteQRCodeSubscriptionVariables = {
  filter?: ModelSubscriptionQRCodeFilterInput | null,
};

export type OnDeleteQRCodeSubscription = {
  onDeleteQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnDeleteRatingSubscriptionVariables = {
  filter?: ModelSubscriptionRatingFilterInput | null,
};

export type OnDeleteRatingSubscription = {
  onDeleteRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnDeleteShiftSubscriptionVariables = {
  filter?: ModelSubscriptionShiftFilterInput | null,
};

export type OnDeleteShiftSubscription = {
  onDeleteShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
};

export type OnUpdateAnalyticsSubscription = {
  onUpdateAnalytics?:  {
    __typename: "Analytics",
    activeWaiters?: number | null,
    averageRating?: number | null,
    createdAt: string,
    date: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    metrics?: string | null,
    period?: AnalyticsPeriod | null,
    topWaiterId?: string | null,
    totalPoints?: number | null,
    totalRatings?: number | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateBadgeSubscriptionVariables = {
  filter?: ModelSubscriptionBadgeFilterInput | null,
};

export type OnUpdateBadgeSubscription = {
  onUpdateBadge?:  {
    __typename: "Badge",
    createdAt: string,
    criteria?: string | null,
    description?: string | null,
    earnedAt: string,
    icon?: string | null,
    id: string,
    name: string,
    type?: BadgeType | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnUpdateHotelSubscriptionVariables = {
  filter?: ModelSubscriptionHotelFilterInput | null,
};

export type OnUpdateHotelSubscription = {
  onUpdateHotel?:  {
    __typename: "Hotel",
    address?: string | null,
    analyticsEntries?:  {
      __typename: "ModelAnalyticsConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    id: string,
    name: string,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    timezone?: string | null,
    updatedAt?: string | null,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateQRCodeSubscriptionVariables = {
  filter?: ModelSubscriptionQRCodeFilterInput | null,
};

export type OnUpdateQRCodeSubscription = {
  onUpdateQRCode?:  {
    __typename: "QRCode",
    createdAt?: string | null,
    expiresAt: string,
    id: string,
    isUsed?: boolean | null,
    shift?:  {
      __typename: "Shift",
      averageRating?: number | null,
      createdAt: string,
      endTime?: string | null,
      hotelId: string,
      id: string,
      isActive?: boolean | null,
      pointsEarned?: number | null,
      ratingsCount?: number | null,
      startTime: string,
      totalTips?: number | null,
      updatedAt: string,
      waiterId: string,
    } | null,
    shiftId: string,
    token: string,
    updatedAt: string,
    url: string,
    usedAt?: string | null,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnUpdateRatingSubscriptionVariables = {
  filter?: ModelSubscriptionRatingFilterInput | null,
};

export type OnUpdateRatingSubscription = {
  onUpdateRating?:  {
    __typename: "Rating",
    ambianceRating?: number | null,
    comment?: string | null,
    createdAt: string,
    deviceInfo?: string | null,
    flaggedReason?: string | null,
    foodRating?: number | null,
    guestName?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isFlagged?: boolean | null,
    isResolved?: boolean | null,
    qrToken?: string | null,
    rating: number,
    resolutionNotes?: string | null,
    resolvedAt?: string | null,
    resolvedBy?: string | null,
    serviceRating?: number | null,
    tableNumber?: string | null,
    timestamp: string,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnUpdateShiftSubscriptionVariables = {
  filter?: ModelSubscriptionShiftFilterInput | null,
};

export type OnUpdateShiftSubscription = {
  onUpdateShift?:  {
    __typename: "Shift",
    averageRating?: number | null,
    createdAt: string,
    endTime?: string | null,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId: string,
    id: string,
    isActive?: boolean | null,
    pointsEarned?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratingsCount?: number | null,
    startTime: string,
    totalTips?: number | null,
    updatedAt: string,
    waiter?:  {
      __typename: "User",
      averageRating?: number | null,
      createdAt?: string | null,
      email: string,
      hotelId?: string | null,
      id: string,
      isActive?: boolean | null,
      level?: number | null,
      name: string,
      points?: number | null,
      role?: UserRole | null,
      totalRatings?: number | null,
      updatedAt?: string | null,
    } | null,
    waiterId: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    averageRating?: number | null,
    badges?:  {
      __typename: "ModelBadgeConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    email: string,
    hotel?:  {
      __typename: "Hotel",
      address?: string | null,
      createdAt?: string | null,
      id: string,
      name: string,
      timezone?: string | null,
      updatedAt?: string | null,
    } | null,
    hotelId?: string | null,
    id: string,
    isActive?: boolean | null,
    level?: number | null,
    name: string,
    points?: number | null,
    qrCodes?:  {
      __typename: "ModelQRCodeConnection",
      nextToken?: string | null,
    } | null,
    ratings?:  {
      __typename: "ModelRatingConnection",
      nextToken?: string | null,
    } | null,
    role?: UserRole | null,
    shifts?:  {
      __typename: "ModelShiftConnection",
      nextToken?: string | null,
    } | null,
    totalRatings?: number | null,
    updatedAt?: string | null,
  } | null,
};
