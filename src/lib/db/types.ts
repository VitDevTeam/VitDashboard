

export interface UsersTable {
    id: string;
    guild_id: string;
    coins: string;
    energy: string;
    energy_max: string;
    mood: string;
    mood_max: string;
}

export interface InventoryTable {
    id: string;          
    item_id: number;
    quantity: number;
}

export interface ItemsTable {
    id: number;
    name: string;
    description: string;
    icon: string;
    is_usable: boolean;
}

export interface user_effects {
    id: number;
    name: string;
    description: string;
    icon: string;
}


export interface current_effects {
    id: number;
    user_id: string;
    effect_id: number;
    applied_at : Date;
    duration : number;  // as tick, 1 tick = 30 sec.
}

export interface guilds {
    id:string;
    coins:string;
}

export interface guild_config {
    guild_id:string;
    prefix:string;
    allow_rob: boolean;
    
}

export interface user {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string;
}

export interface session {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
}

export interface account {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    accessTokenExpiresAt?: Date;
    refreshTokenExpiresAt?: Date;
    scope?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface verification {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RecipesTable {
    id: number;
    name: string;
}

export interface RecipeResultsTable {
    recipe_id: number;
    item_id: number;
    quantity: number;
}

export interface RecipeRequireItemsTable {
    recipe_id: number;
    item_id: number;
    quantity: number;
    is_consumed: boolean;
}

export interface TradesTable {
    id: number;
    offerer_id: string;
    item_id: number;
    quantity: number;
    price: number;
    created_at: Date;
}

export interface Database {
    users: UsersTable;
    inventory: InventoryTable;
    items: ItemsTable;
    recipes: RecipesTable;
    recipe_results: RecipeResultsTable;
    recipe_require_items: RecipeRequireItemsTable;
    trades: TradesTable;
    user_effects : user_effects;
    current_effects : current_effects;
    guilds: guilds;
    guild_config: guild_config;
    user: user;
    session: session;
    account: account;
    verification: verification;
}
