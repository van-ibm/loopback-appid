# loopback-appid

Conveniently adds an IBM App ID authentication strategy to Loobpack 4.

## Usage

Within your `index.ts` `main` function, add the authentication strategy to your app.

```javascript
import { AppIdAuthentication } from 'loopback-appid';
...

export async function main(options: ApplicationConfig = {}) {
  const app = new Application(options);

  // creates an authentication strategy for appid
  const appid = new AppIdAuthentication(app);
...
}
```

Then in your controller, decorate your APIs with the `@authenticate` decorator.

```javascript
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';
...

constructor(
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile,
    @repository(OrderRepository) protected orderRepository: OrderRepository,
  ) { }
...

@authenticate('appid-api-strategy')
@get(`/orders/{orderId}`)
async orderById(
  @param.path.string('orderId') orderId: string
): Promise<Order> {
  return await this.orderRepository.findById(orderId);
}
```