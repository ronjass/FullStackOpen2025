import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationTimeout } from "../reducers/notificationReducer";

const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        if (state.filter === 'ALL') {
            return state.anecdotes 
        } else {
            const filteredAnecdotes = state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
            return filteredAnecdotes
        }
    })

    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote.id))
        dispatch(setNotificationTimeout(`you voted '${anecdote.content}'`, 5))

    }

    return (
        <div>
        {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
              </div>
            </div>
        )}
        </div>
    )
}

export default Anecdotes