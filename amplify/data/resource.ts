import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Hotel model
  Hotel: a
    .model({
      name: a.string().required(),
      address: a.string(),
      timezone: a.string().default('UTC'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // User model (waiters and managers)
  User: a
    .model({
      email: a.string().required(),
      name: a.string().required(),
      role: a.enum(['waiter', 'manager', 'admin']),
      hotelId: a.id(),
      points: a.integer().default(0),
      level: a.integer().default(1),
      totalRatings: a.integer().default(0),
      averageRating: a.float().default(0),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relationships
      hotel: a.belongsTo('Hotel', 'hotelId'),
      shifts: a.hasMany('Shift', 'waiterId'),
      ratings: a.hasMany('Rating', 'waiterId'),
      badges: a.hasMany('Badge', 'waiterId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // Rating model
  Rating: a
    .model({
      waiterId: a.id().required(),
      hotelId: a.id().required(),
      rating: a.integer().required(),
      serviceRating: a.integer(),
      foodRating: a.integer(),
      ambianceRating: a.integer(),
      comment: a.string(),
      tableNumber: a.string(),
      guestName: a.string(),
      timestamp: a.datetime().required(),
      qrToken: a.string(),
      deviceInfo: a.json(),
      isFlagged: a.boolean().default(false),
      flaggedReason: a.string(),
      isResolved: a.boolean().default(false),
      resolvedBy: a.id(),
      resolvedAt: a.datetime(),
      resolutionNotes: a.string(),
      
      // Relationships
      waiter: a.belongsTo('User', 'waiterId'),
      hotel: a.belongsTo('Hotel', 'hotelId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // QR Code model
  QRCode: a
    .model({
      waiterId: a.id().required(),
      shiftId: a.id().required(),
      token: a.string().required(),
      url: a.string().required(),
      isUsed: a.boolean().default(false),
      usedAt: a.datetime(),
      expiresAt: a.datetime().required(),
      createdAt: a.datetime(),
      
      // Relationships
      waiter: a.belongsTo('User', 'waiterId'),
      shift: a.belongsTo('Shift', 'shiftId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // Shift model
  Shift: a
    .model({
      waiterId: a.id().required(),
      hotelId: a.id().required(),
      startTime: a.datetime().required(),
      endTime: a.datetime(),
      isActive: a.boolean().default(true),
      pointsEarned: a.integer().default(0),
      ratingsCount: a.integer().default(0),
      averageRating: a.float().default(0),
      totalTips: a.float().default(0),
      
      // Relationships
      waiter: a.belongsTo('User', 'waiterId'),
      hotel: a.belongsTo('Hotel', 'hotelId'),
      qrCodes: a.hasMany('QRCode', 'shiftId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // Badge model
  Badge: a
    .model({
      waiterId: a.id().required(),
      type: a.enum(['service_star', 'customer_favorite', 'team_player', 'rising_star', 'efficiency_expert']),
      name: a.string().required(),
      description: a.string(),
      icon: a.string(),
      earnedAt: a.datetime().required(),
      criteria: a.json(),
      
      // Relationships
      waiter: a.belongsTo('User', 'waiterId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // Analytics model for aggregated data
  Analytics: a
    .model({
      hotelId: a.id().required(),
      period: a.enum(['daily', 'weekly', 'monthly']),
      date: a.date().required(),
      totalRatings: a.integer().default(0),
      averageRating: a.float().default(0),
      totalPoints: a.integer().default(0),
      activeWaiters: a.integer().default(0),
      topWaiterId: a.id(),
      metrics: a.json(),
      
      // Relationships
      hotel: a.belongsTo('Hotel', 'hotelId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
