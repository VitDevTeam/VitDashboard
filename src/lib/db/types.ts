

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

export interface UserEffects {
    id: number;
    name: string;
    description: string;
    icon: string;
}


export interface UserCurrentEffects {
    id: number;
    user_id: string;
    effect_id: number;
    applied_at : Date;
    duration : number;  // as tick, 1 tick = 30 sec.
}

// Database interface
export interface Database {
    users: UsersTable;
    inventory: InventoryTable;
    items: ItemsTable;
    userEffects : UserEffects;
    currentEffects : UserCurrentEffects;
}
