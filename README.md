## limits.js

Most Web services have certain limitations regarding how many requests your client application can
do in specific timeranges. Dealing with these limitations can be tough, especially if the limitations
are more complex like for example: "You can do one request in a second but only a maximum of
20 requests in a minute and a maximum of 100 requests in an hour".
This is where limits.js comes to help. limits.js makes sure you don't exceed the given limitations.
limits.js works with Node.JS and in the Browser.

### Sample

```javascript

limits = require('limits.js');

queue = limits({
    secondly: 1, // allow 1 call per second
    minutely: 2  // allow 2 calls per minute
});

queue.push(function() {
    // this function will run instantly
});

queue.push(function() {
    // this function will run after
    // a 1 second delay
});

queue.push(function() {
    // this function will run
    // after a 60 second delay
    // since we already exceeded
    // the two calls per minute restriction
});

queue.push(function() {
    // this function will not get executed
    // because we have defined an conditional
    // function which defines that this function
    // should only get called if the delay is
    // under 10 seconds.
}, function(delay) {
    return delay < 10000;
});

```

### Installation

#### Node.JS

```
npm install limits.js
```

#### Browser

There is minified version availible in the build directory.

### Usage

```javascript

var service = limits({

                           // The Number of calls permitted...
    secondly:   Number,    // ...in one second
    minutely:   Number,    // ...in one minute
    quarterly:  Number,    // ...in an quarter of an hour
    hourly:     Number,    // ...in an hour
    daily:      Number,    // ...in one day
    weekly:     Number,    // ...in one week

    history:    Array,     // Array of timestamps ( Date.now() )
                           // from previous calls

    onCall:     Function,  // Callback Function which gets fired
                           // everytime a call gets executed. Passed
                           // in as first argument you get the delay
                           // in milliseconds with which the function
                           // was called.
                           // Can be used to persist the call history.

    onClear:    Function,  // Callback Function which gets fired
                           // everytime a part of the backlog can be cleared.
                           // First parameter is a Timestamp which indicates
                           // from where on to the past it's save to delete
                           // the history.
});

// You can also specify the number of calls permitted
// in an certain timerange like this:

service.secondly(Numeric);
service.minutely(Numeric);
service.quarterly(Numeric);
service.hourly(Numeric);
service.daily(Numeric);
service.weekly(Numeric);

// The predefined ranges don't fit to your requirements?
// No problem, try this:

service.within(timerange, maxcalls);

// With the 'push' method you are able to push a function
// into the execution stack.
// If the call doesn't get aborted by the second conditional function
// you will get an object in return containing an 'delay' property, which indicates
// with which delay the function will get called and an 'timer' property which
// holds the return of the setTimeout function.

var myCall = service.push(function() {
    // Here we do our API call.
    // The execution of this function will get
    // delayed if we have reached the limitations.

}, function(delay) {
    // This is an optional conditional function.
    // It gets an parameter 'delay' passed in which
    // indicates when the call will get executed.
    // If delay is 0 the call will get executed immediately (although asynchronily).

    // Returning 'false' will prevent the call from being executed.
});

```


## License
Copyright (c) 2014 Simon Kusterer
Licensed under the MIT license.