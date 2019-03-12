# VbrPulsar Module

## @ngx-viber/pulsar

## Table of Contents
* [What is it for](#what-is-it-for)
* [Installation](#installation)

## What is it for
Should be used to track processes activity.

We are using it
* As network activity detector for whole application.
* For the graphs preloaders, when more than one graph data source exists.
* Application initialization flow tracking.
* Preloader depended on few not related request processes.

Services:
* [VbrPulsarService](#VbrPulsarService) - Keep track on process groups.

Misc:
* rxjsVbrPulsar - rxjs operator

## Installation
```bash
npm install @viberlabs/pulsar --save
```

## VbrPulsarService
The purpose of this service is to keep count of the currently active processes.

### Methods
| Name | Description |
|------|-------------|
| ```start(name: string = this.defaultProcessName): VbrPulsarProcess ``` |  Return newly created process and adds it to service counters. process could be complete by calling .stop() method | 
| ```append(process: Observable<VbrPulsarDelta>) ``` |  Append Observable of VbrPulsarDelta VbrPulsarService processes |
| ```count$(name: string = this.defaultProcessName): Observable<number> ``` |  Observable emits number of active processes identified by optional parameter "name". When not provided with parameter, default parameter name value used - 'default'. When asked for never active activity, 0 will be emitted.
| ```count(name: string = this.defaultProcessName): number``` | Get number of active processes identified by optional parameter "name" |
| ```isActive$(name: string = this.defaultProcessName): Observable<boolean>``` | Observable emits activity identified by optional parameter "name" is active or not. When not provided with parameter, default parameter name value used - 'default' |
| ```isActive(name: string = this.defaultProcessName): boolean``` | Check activity identified by optional parameter "name" is active or not. When not provided with parameter, default parameter name value used - 'default'. |


## Usage Examples

In your module add `VbrPulsarService` to services section.
```typescript
impors: [
 VbrPulsarService,
]
```

In any other component or service
```typescript
@Injectable()
export class MyService {
  constructor(public service: VbrPulsarService) {
  }

  public asPipeOperator() {
    return of('result')
      .pipe(
        delay(5000),
        // Set default process as active on subscribe and deactivate the moment observable resolved or error throwed
        rxjsVbrProcess(this.service),
      );
  }

  public manual() {
    console.log(this.service.count('first'), this.service.isActive('first')); // Output: 0, false
    
    // Create and start process with a group name 'first'
    const process1= this.service.start('first');
    console.log(this.service.count('first'), this.service.isActive('first')); // Output: 1, true
    
    // Start another with the same group name
    const process2 = this.service.start('first');
    console.log(this.service.count('first'), this.service.isActive('first')); // Output: 2, true
    
    // deactivate processs1 
    process1.stop();
    // this.service.isActive('first') will return true, since process2 is still active 
    console.log(this.service.count('first'), this.service.isActive('first')); // Output: 1, true
    
    // Deactivate process2 after 5 seconds
    setTimeout(() => {
      // Stop proc1ess
      process2.stop();
      console.log(this.service.count('first'), this.service.isActive('first')); // Output: 0, false
    }, 5000);
  }
}

```

In interceptor, active while any request in progress
```typescript
@Injectable()
export class VbrActiveRequestsDetectorInterceptor implements HttpInterceptor {

  constructor(private progressStatusService: VbrPulsarService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        // rxjsVbrProcess will mark 'http request' process as active and will deactivate it when request is done
        rxjsVbrProcess(this.progressStatusService, 'http requests'),
      );
  }
}
```
