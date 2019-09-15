import * as React from 'react'
import TodoStore from './TodoStore'
import TodoItem from './TodoItem'
import * as cx from 'classnames'

type FilterOptions = 'all' | 'completed' | 'active'

const Filters = {
    completed: (todo: Todo) => todo.completed,
    active: (todo: Todo) => !todo.completed,
    all: (todo: Todo) => true
}

interface Todo {
    id: number
    title: string
    completed: boolean
}

interface TodoListProps { }

interface TodoListState {
    todos: Todo[],
    newTodo: string,
    filter: FilterOptions
}

export default class TodoList extends React.PureComponent<TodoListProps, TodoListState> {
    private store : TodoStore = new  TodoStore()
    private toggleTodo: (todo: Todo) => void
    private destroyTodo: (todo: Todo) => void
    private updateTitle: (todo: Todo, title: string) => void
    private clearCompleted: () => void


    constructor(props: TodoListProps){
        super(props);
        this.state = {
            todos: [],
            newTodo: '',
            filter: 'all'
        }

        //On souscrit aux changements du store     先把一个回调函数（负责同步store里面的todos于state里面的todos）注册到store内部的callbacks数组，之后一旦store的内容改变就会通过inform函数来调用这个回调函数
        this.store.onChange((store) => {
            this.setState({todos: store.todos})
        })

        //On injecte les methodes du store en methode du composant
        this.toggleTodo = this.store.toggleTodo.bind(this.store)
        this.destroyTodo = this.store.removeTodo.bind(this.store)
        this.updateTitle = this.store.updateTitle.bind(this.store)
        this.clearCompleted = this.store.clearCompleted.bind(this.store)
    }

    get remainingCount() : number{
        return this.state.todos.reduce((count, todo) => !todo.completed ? count+1 : count, 0)
    }

    get completedCount() : number {
        return this.state.todos.reduce((count, todo) => todo.completed ? count+1: count, 0)
    }

    render() {
        let { todos, newTodo, filter } = this.state;
        let todosFiltered = todos.filter(Filters[filter]) //la liste todosFiltered change quand l'option de filtre change
        let remainingCount = this.remainingCount
        let completedCount = this.completedCount

        return <section className="todoapp">
            <header className="header">
                <h1>todos</h1>
                <input
                    className="new-todo"
                    value={newTodo}
                    placeholder="What needs to be done?"
                    onKeyPress={this.addTodo}
                    onChange={this.updateNewTodo}/>
            </header>
            <section className="main">
                {todos.length > 0 &&
                <input id="toggle-all" className="toggle-all" type="checkbox" checked={remainingCount === 0} onChange={this.toggle}/>}
                <label htmlFor="toggle-all"></label>
                <ul className="todo-list">
                    {todosFiltered.map(todo => {
                        return <TodoItem
                            todo={todo}
                            key={todo.id}
                            onToggle={this.toggleTodo}
                            onDestroy={this.destroyTodo}
                            onUpdate={this.updateTitle}
                        />
                    })}
                </ul>
            </section>
            <footer className="footer">
                {remainingCount > 0 && <span
                    className="todo-count"><strong>{remainingCount}</strong> item{remainingCount > 1 && 's'} left</span>}
                <ul className="filters">
                    <li>
                        <a href="#/" className={cx({ selected: filter === 'all' })} onClick={this.setFilter('all')}>All</a>
                    </li>
                    <li>
                        <a href="#/active" className={cx({ selected: filter === 'active' })}
                           onClick={this.setFilter('active')}>Active</a>
                    </li>
                    <li>
                        <a href="#/completed" className={cx({ selected: filter === 'completed' })}
                           onClick={this.setFilter('completed')}>Completed</a>
                    </li>
                </ul>
                {completedCount > 0 &&
                <button className="clear-completed" onClick={this.clearCompleted}>Clear completed</button>}
            </footer>
        </section>;
    }


    addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            this.store.addTodo(this.state.newTodo)
            this.setState({newTodo: ''})
        }
    }

    updateNewTodo = (e: React.FormEvent<HTMLInputElement>) => {
        console.log("updateNewTodo")
        this.setState({newTodo: (e.target as HTMLInputElement).value})
    }

    setFilter = (filter: FilterOptions) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            this.setState({ filter })
        }
    }

    toggle = (e: React.FormEvent<HTMLInputElement>) => {
        this.store.toggleAll(this.remainingCount > 0)
    }
    
}