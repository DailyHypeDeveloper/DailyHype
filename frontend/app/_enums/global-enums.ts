/**
 * enum used for current active page values
 */
export enum CurrentActivePage {
  Home = "home",
  Man = "man",
  Woman = "woman",
  Kid = "kid",
  Baby = "baby",
  PersonalCenter = "personal center",
  Profile = "my profile",
  AddressBook = "address book",
  ManageAccount = "manage my account",
  AllOrder = "all orders",
  InProgressOrder = "in progress orders",
  ConfirmedOrder = "confirmed orders",
  DeliveredOrder = "delivered orders",
  ReceivedOrder = "received orders",
  CancelledOrder = "cancelled orders",
  ReturnedOrder = "returned orders",
  AllDelivery = "all deliveries",
  Dashboard = "dashboard",
  UserForm = "user form",
  None = "none",
}

/**
 * enum used for url routing
 */
export enum URL {
  Home = "/",
  Man = "/man",
  Woman = "/woman",
  Kid = "/kid",
  Baby = "/baby",
  Cart = "/cart",
  Personal = "/personal",
  Profile = "/profile",
  AllOrder = "/order/all",
  Delivery = "/delivery",
  SignIn = "/signin",
  SignUp = "/signup",
  About = "/about",
  Contact = "/contact",
  Feedback = "/feedback",
  Help = "/help",
  PrivacyPolicy = "/privacypolicy",
  TermsNConditions = "/terms",
  SiteMap = "/sitemap",
  Dashboard = "/dashboard",
  UserForm = "/form/user",
  ProductForm = "/form/product"
}

/**
 * enum used for error message
 */
export enum ErrorMessage {
  Unauthorized = "Unauthorized Access!",
}
