# CoW CMS Library
Library for CoW CMS.

It exports the types and client to interact with the CMS API.

## 🚀 Usage

```ts
import { CoWClient } from 'cow-cms';

// Create a new client
const client = new CoWClient({
  url: 'https://cms.cow.fi'
});

// Get 25 articles
const { data, error, response } = await client.GET("/articles", {
  params: {
    query: {
      "pagination[page]": 0,
      "pagination[pageSize]": 25
    }
  }
})
```