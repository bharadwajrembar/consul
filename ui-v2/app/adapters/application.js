import Adapter from './http';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export const DATACENTER_QUERY_PARAM = 'dc';
export default Adapter.extend({
  repo: service('settings'),
  client: service('client/http'),
  // TODO: kinda protected for the moment
  // decide where this should go either read/write from http
  // should somehow use this or vice versa
  request: function(req, resp, obj, modelName) {
    const client = this.client;
    const store = this.store;
    const adapter = this;

    let unserialized, serialized;
    const serializer = store.serializerFor(modelName);
    // workable way to decide whether this is a snapshot
    // essentially 'is attributable'.
    // Snapshot is private so we can't do instanceof here
    if (typeof obj.attributes === 'function') {
      unserialized = obj.attributes();
      serialized = serializer.serialize(obj, {});
    } else {
      unserialized = obj;
      serialized = unserialized;
    }

    return client
      .request(function(request) {
        return req(adapter, request, serialized, unserialized);
      })
      .catch(function(e) {
        return adapter.error(e);
      })
      .then(function(response) {
        // TODO: When HTTPAdapter:responder changes, this will also need to change
        return resp(serializer, response, serialized, unserialized);
      });
    // TODO: Potentially add specific serializer errors here
    // .catch(function(e) {
    //   return Promise.reject(e);
    // });
  },
});
