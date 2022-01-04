export type COFFEE = {
  id: number;
  coffee_name: string;
  coffee_detail: string;
  img: string;
  coffee_priceL: number;
  coffee_priceM: number;
};

export type TOPPING = {
  id: number;
  topping_name: string;
  topping_priceL: number;
  topping_priceM: number;
};

export type LOGIN = {
  email: string;
  password: string;
};

export type REGISTER = {
  email: string;
  password1: string;
  password2: string;
};

export type USER = {
  token: string;
  user: {
    id: number;
    email: string;
  };
};

export type CART = {
  id: number;
  userCart: number;
  order_name?: string;
  addressnumber?: string;
  address?: string;
  email?: string;
  order_date?: string;
  order_time?: number;
  tel?: string;
  status?: number;
};

export type ORDEREDCOFFEE = {
  id: number;
  item_number: number;
  coffee_id: number;
  item_size: string;
  toppings: number[];
  carts: number;
  day?: string;
};

export type ORDERCOFFEEWITHNAME = {
  name: string;
  image: string;
  item_number: number;
  item_size: string;
  price: number;
  toppings: any;
  day?: string;
};

export type BUY = {
  id: number;
  order_name: string;
  addressnumber: string;
  address: string;
  email: string;
  order_date: string;
  order_time: string;
  tel: string;
  status: number;
};
