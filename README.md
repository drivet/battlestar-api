# battlestar-gateway

The API gateway for this silly Battlestar game.  This service will

* Decode the JWT id token on the authorization header
* Forward the request to the backend API service with a simple (though long and random) API key and the uid from the id token.


The backend API service can therefore be reasonably certain that the gateway is making the API call on behalf of the correct user.
