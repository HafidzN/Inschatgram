export const initialState = null

export const userReducer = (state, action) => {
    if (action.type === 'USER'){
        return action.payload
    }
    if (action.type === 'CLEAR'){
        return null
    }
    if(action.type === 'UPDATE'){
        console.log(action.payload)
        return {
            ...state,
            following: [ ...action.payload.following],
            followers: [ ...action.payload.followers],
            saved    : [ ...action.payload.saved]
        }
    }
    if (action.type === 'UPDATE_PHOTO'){
        return {
            ...state,
            photo: action.payload
        }
    }
    if (action.type === 'UPDATE_BIO'){
        return {
            ...state,
            bio: action.payload
        }
    }
    if(action.type === 'UPDATE_STORY'){
        return {
            ...state,
            story: action.payload.result
        }
    }
    if(action.type === 'DELETE_STORY'){
        return {
            ...state,
            story: null
        }
    }
}