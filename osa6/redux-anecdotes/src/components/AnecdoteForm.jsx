import { useDispatch  } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationTimeout } from "../reducers/notificationReducer";
import anecdoteService from '../services/anecdotes'

const NewAnecdote = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(createAnecdote(newAnecdote))
        dispatch(setNotificationTimeout(`new anecdote: '${content}'`, 5))
    }
    
    return (
    <div>
    <h2>create new</h2>
        <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
        </form>
    </div>
    )
}

export default NewAnecdote