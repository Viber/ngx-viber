# LocalStorageService SessionStorageService

### The service for local and session storage

### @viberlab/vbr-storage

store(key: string, value: any) - sets some *value* by the name *key*

retrieve(key: string) - gets the value by the name *key*

clear(key?: string) - removes the value by the name *key*, 
                      clears all storage if there is not *key*

observe(key: string) - observes the storage by the name *key*

import in module:

```typescript
VbrStorageModule.forRoot({
  prefix: 'your_prefix'
})
```
**prefix** adds *your_prefix-* to the key in storage (optional)