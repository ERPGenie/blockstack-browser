import * as types from './types'
import { DEFAULT_PROFILE } from '../../../utils/profile-utils'

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null,
    zoneFile: null
  },
  default: null,
  localIdentities: {},
  namesOwned: [],
  createProfileError: null,
  zoneFileUpdates: []
}

function IdentityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_CURRENT:
      return Object.assign({}, state, {
        current: {
          domainName: action.domainName,
          profile: action.profile,
          verifications: action.verifications,
          zoneFile: action.zoneFile
        }
      })
    case types.SET_DEFAULT:
      return Object.assign({}, state, {
        default: action.domainName
      })
    case types.CREATE_NEW:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: {
            domainName: action.domainName,
            profile: DEFAULT_PROFILE,
            verifications: [],
            registered: false,
            ownerAddress: action.ownerAddress,
            zoneFile: null
          }
        })
      })
    case types.UPDATE_IDENTITIES:
      return Object.assign({}, state, {
        localIdentities: action.localIdentities,
        namesOwned: action.namesOwned
      })
    case types.UPDATE_PROFILE:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: Object.assign({}, state.localIdentities[action.domainName], {
            profile: action.profile,
            zoneFile: action.zoneFile
          })
        })
      })
    case types.ADD_USERNAME: {
      const localIdentitiesCopy = Object.assign({}, state.localIdentities, {
        [action.domainName]: Object.assign({}, state.localIdentities[action.ownerAddress], {
          domainName: action.domainName,
          zoneFile: action.zoneFile
        })
      })
      delete localIdentitiesCopy[action.ownerAddress]
      return Object.assign({}, state, {
        localIdentities: localIdentitiesCopy
      })
    }
    case types.RESET_CREATE_PROFILE_ERROR: {
      return Object.assign({}, state, {
        createProfileError: null
      })
    }
    case types.CREATE_PROFILE_ERROR: {
      return Object.assign({}, state, {
        createProfileError: new String(action.error)
      })
    }
    case types.BROADCASTING_ZONE_FILE_UPDATE: {
      let zoneFileUpdates = []
      if (state.zoneFileUpdates) {
        zoneFileUpdates = state.zoneFileUpdates
      }
      return Object.assign({}, state, {
        zoneFileUpdates: Object.assign({}, zoneFileUpdates, {
          [action.domainName]: Object.assign({}, zoneFileUpdates[action.domainName], {
            broadcasting: true,
            error: null
          })
        })
      })
    }
    case types.BROADCASTED_ZONE_FILE_UPDATE:
      return Object.assign({}, state, {
        zoneFileUpdates: Object.assign({}, state.zoneFileUpdates, {
          [action.domainName]: Object.assign({}, state.zoneFileUpdates[action.domainName], {
            broadcasting: false,
            error: null
          })
        })
      })
    case types.BROADCASTING_ZONE_FILE_UPDATE_ERROR:
      return Object.assign({}, state, {
        zoneFileUpdates: Object.assign({}, state.zoneFileUpdates, {
          [action.domainName]: Object.assign({}, state.zoneFileUpdates[action.domainName], {
            broadcasting: false,
            error: action.error
          })
        })
      })
    default:
      return state
  }
}

export default IdentityReducer
