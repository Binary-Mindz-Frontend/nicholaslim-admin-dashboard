export enum Module {
    DASHBOARD = "dashboard",
    RAIDER = "raider",
    ORDER = 'order',
    PAYMENT_TRANSACTION = 'payment_transaction',
    VECHICLE_PRICING = "vechicle_pricing",
    WALLET = "wallet",
    COIN = "coin",
    QUIZ = "quiz",
    PLATFORM_FEE = "platform_fee",
    CUSTOMER_ORDER_CONFIRMATION = "customer_order_confirmation",
    RBAC = "rbac",
    //DESTINATION
    DESTINATION = 'destination',
    // my raider
    MY_RAIDER = "my_raider",
    // Payment_option module
    PAYMENT_METHOD = "payment_method",
    // referral module
    REFERRAL = "referral",
    ADDITIONAL_SERVICES = "additional_services",
    USER_PROFILE = "user_profile",
    // new //  user
    USER_WEB = 'user_web',
    USER = 'user',
    // 
    USER_MOBILE = 'user_mobile',
    // USER = 'user',

    // user wallet 
    USER_WALLET = "user_wallet",
    RAIDER_WALLET = "raider_wallet",
    // services configuaration
    SERVICE_AREAS = "service_areas",
    VEHICLE_TYPE = 'vehicle_type',
    DELIVERY_TYPE = 'delivery_type',
    POLICIES = 'policies',
    // revenue configuaration
    REVENUE_CONFIGURATION = "revenue_order_config",
    // customer configuaration
    ADDITIONAL_ORDER_SERVICE = 'additionl_order_service',
    ORDER_CONFIRMATION = 'order_confirmation',
    //driver configuaration
    DRIVER_ORDER_COMPETITION = 'driver_order_compitition',
    QUIZZES = 'quizzes',
    // incentive rewards configurations
    DRIVER_INCENTIVE = 'driver_incentive',
    CUSTOMER_REWARDS = 'customer_rewards',
    PROMO_CODE = 'promo_code',

    // finance reporting // report-and-analytics/kpi-stats
    COIN_STATS = 'coin_stats',
    INCENTIVE_ANALYSIS = 'incentive_analytics',
    KPI_STATS = 'kpi_stats',
    TRANSACTION_STATS = 'transactions_stats',

    // report and analysis
    REPORT_ANALYTICS = "report_analytics",
    REPORT_ANALYTICS_STATS = "report_analytics_stats",
    // live map fleet tacking
    LIVE_MAP = "live_map",
    // support and communication
    CONTACT_INFO = 'contact_info',
    SUPPORT_DISPUTE = 'support_dispute',
    NOTIFICATION = "notification",
    SERVICE_CHAT = 'service_chat',

    // marketing engagement
    ADVERTISEMENT = "advertisement",
    DASHBOARD_POPUP = "dashboard_popup",
    // content management
    CONTENT_MANAGEMENT = "content_management",
    FAQ = "faq",
    // order management
    ORDER_PLACEMENT = "order_placement", //order placement
    RAIDER_JOIN = "raider_join",
    SURGE_PRICING_ROLE = "surge_pricing_role",
    ADMIN_USER_WALLET = "admin_user_wallet",
    ADMIN_RAIDER_WALLET = "admin_raider_wallet",
    DRIVER_TIER_ROLE = "driver_tier_role",
    ETA = "eta",
    NOTIFICATION_RULE = "notification_rule",
}

export enum Permission {
    READ = "read",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    GET_ONE = "get_one",
}
