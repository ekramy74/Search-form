
export const SearchActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_RESULTS: 'SET_RESULTS',
    CLEAR_RESULTS: 'CLEAR_RESULTS',
}
export const SearchInitialState = {
    loading: false,
    results: [],
}

export const SearchReducer = (state = SearchInitialState, action) => {
    switch (action.type) {
        case SearchActionTypes.SET_LOADING:
            return {...state, loading: action.payload}

        case SearchActionTypes.SET_RESULTS:
            const results = action.payload?.map((item) => {
                let description = ''
                if (item?.descriptions?.length > 0)
                    description = item.descriptions.map((desc) => {
                        return Object.values(desc).join(', ')
                    })
                return {
                    score: item?.score,
                    name: item?.name,
                    nationality: item?.nat,
                    places_of_birth: item?.places_of_birth?.join(', '),
                    descriptions: description.join(', ')
                }
            })
            return {
                ...state,
                results: results,
                loading: false,
            }
        case SearchActionTypes.CLEAR_RESULTS:
            return {...state, results: []}
        default:
            return state
    }
}
