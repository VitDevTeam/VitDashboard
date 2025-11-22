

export interface UsersTable {
    id: string;
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

// Database interface
export interface Database {
    users: UsersTable;
    inventory: InventoryTable;
    items: ItemsTable;
    user_effects : user_effects;
    current_effects : current_effects;
    guilds: guilds;
}
