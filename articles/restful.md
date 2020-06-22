# REST

REST 是围绕 Resource 来设计的，那么“用户”相关的功能肯定都是以“用户”为 Resource 的，而 REST 提供了一个基本思路就是使用 HTTP 的 method 来代表逻辑上对资源的操作：
- POST：创建
- GET：获取
- PUT：修改
- DELETE：删除

## 那么相应的，用户的 API 有这几个：
- 创建一个用户：POST /user
- 获取一个用户：GET /user
- 修改一个用户：PUT /user
- 删除一个用户：DELETE /user

### 使用 querystring 来进行查询，比如删除 id 为 123 的用户：
```js
DELETE /user?id=123
```

## 有时候会有需求一次对多个用户进行操作，那么这时候有两种思路：
### 1. 把“一批用户”作为一个独立的 Resource：
- 创建一批用户：POST /user_batch
- 获取一批用户：GET /user_batch
- 修改一批用户：PUT /user_batch
- 删除一批用户：DELETE /user_batch

### 2. 让“用户”Resource 具有“批量”的 Action：
- 创建一批用户：POST /user/batch
- 获取一批用户：GET /user/batch
- 修改一批用户：PUT /user/batch
- 删除一批用户：DELETE /user/batch

用哪种思路可以带入你的实际业务来看未来哪种会更好用一些。


## 那么对于“登录”、“登出”等特殊逻辑，如果依然在用户 Resource 上考虑，是无法简单使用 HTTP method 来代表的，可以抽象成独立的 Resource：
- 登录（创建一个会话）：POST /session
- 登出（删除一个会话）：DELETE /session

### 修改用户昵称和修改密码都是 PUT /user，可以通过判断 Request Body 里传入的是 nickname 还是 password 来决定究竟是调用修改昵称的逻辑，还是调用修改密码的逻辑，还是两个都调用。

## 以上就是 RESTful API 设计的一点皮毛，一些需要注意的点：
1. REST 是一种设计风格，本身并未提供 API 的细节设计，需要自己理解 REST 解决痛点的核心思路，再根据实际业务情况来设计 API 。
2. 如果业务上没有相应的痛点需要 REST，甚至本身与 REST 的思路相矛盾，就不要硬上 REST，例如微服务通信非常适合用 REST，但 BFF 或 API 网关层接口聚合可能更适合用 GraphQL 。
3. Resource 就像是一个对象，其所有接口都应当使用同一套属性定义，比如修改密码的时候使用 password 字段在代表密码属性，那么在获取用户密码哈希的时候就不应该用 password 字段了，应该用 passwordHash 字段，password 字段应该始终代表用户的密码属性，即便这个属性没有存入数据库无法被 GET 出来。
4. API 上定义的 Resource 不一定要和数据库里定义的 Model 一致，比如用户会话“Session”Resource 可能不会存在数据库里，但是在 API 上它可以是个 Resource 。一个更极端的例子是 API 层的用户 Resource 叫“User”，而底层服务数据接口层面可以叫“Customer”，而且双方的数据结构可以有很大区别，通过业务逻辑来进行映射。
5. 一个 Resource 可能会有多个逻辑对应同一个增删改查操作，这时候可能就需要引入 Action 机制，即在每一个 Resource 后面都可以跟一个 Action，来代表执行不同的功能逻辑，如果有多级 Resource 的话，也最好确保每一级 Resource 后面紧跟的都是其 Action 。
6. HTTP 标准并没有说仅 GET method 能用 querystring，甚至没有规定 GET method 不能用 body （虽然很多 HTTP 库禁止 GET 请求传 body，但并不说明标准不允许这么做，实际上 Elasticsearch 的 API 就是在使用 GET method 请求的同时传 body 的），实际上 HTTP 标准中 method 、querystring 、header 、body 是分别定义的，可以自由组合使用。
7. 要合理规划 method 、querystring 、header 、body，哪类参数应该用什么机制来传，要做到始终遵循一套标准。