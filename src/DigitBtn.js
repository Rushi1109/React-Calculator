import { ACTIONS } from './App'

export default function digitBtn({ dispatch, digit }) {
  return (
    <button onClick={() => dispatch({ type:ACTIONS.ADD_DIGIT, payload: {digit} })}>{digit}</button>
  )
}
