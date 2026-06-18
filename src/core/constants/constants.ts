
/* eslint-disable @typescript-eslint/no-unused-vars */
type Operator = {
  id: number;
  name: string;
  phone?: string;
  numOfServicesToday: number;
  numOfServicesThisMonth?: number;
  bestRecordInADay?: number;
  totalServiceCount?: number;
  commissionPercent?: number;
  todayTip?: number;
  thisMonthTip?: number;
  totalTip?: number;
};

type Service = {
  id: number;
  name: string;
  type: string;
  price?: number;
  prices?: CarType[];
  doneToday?: number;
};

type CarType = {
  id: number;
  name: string;
  price?: number;
};

type ShopItem = {
  id: number;
  name: string;
  type: string;
  quantity: number;
  price: number;
  buyPrice?: number;
  soldToday?: number;
};

type Customer = {
  id: Partial<number>;
  name: string;
  phone: string;
  plaqueA: string;
  plaqueB: string;
  plaqueC: string;
  plaqueD: string;
  vehicleType: string;
  serviceCount: Partial<number>;
  lastService: Partial<string>;
  totalServicePaid: Partial<number>;
  totalShopItemBought: Partial<number>;
  totalGivenTips: Partial<number>;
};

type Package = {
  id: number;
  type: string;
  months: number;
  price: number;
  numberOfServices: number;
  discountPerService: number;
  bgColor: string;
  textColor: string;
}

type Station = {
  id: number;
  name: string;
  operator: Partial<Operator>;
  active: boolean;
  customer: Partial<Customer>; // allow empty objects
  services: Service[];
  shopItems: ShopItem[];
};

type BreadCrumb = {
  parentName: string;
  parentPath: string;
};

type Campaign = {
  id: number;
  type: string;
  start: string;
  end: string;
  offAmount?: number;
  priceAmount?: number;
  additionalInfo?: string;
};
