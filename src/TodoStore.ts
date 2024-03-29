import {Todo} from './Interfaces'

declare type ChangeCallback = (store: TodoStore) => void

export default class TodoStore{
    private static i = 0;
    public todos: Todo[] = [];
    private callbacks: ChangeCallback[] = [];

    /**
     * Crée un système d'auto increment
     **/
    private static increment(){
        return this.i++
    }

    /**
     * Informe les écouteurs d'un changement au sein du Store
     * */
    inform () {
        this.callbacks.forEach(cb => cb(this))
    }

    /**
     * Permet d'ajouter un écouteur
     * */
    onChange (cb: ChangeCallback) {
        console.log("onchange !!!! cb = " + cb)
        this.callbacks.push(cb)
    }

    addTodo(title: string): void{
        this.todos = [{
            id: TodoStore.increment(),
            title: title,
            completed: false
        },...this.todos]
        this.inform()
    }

    removeTodo(todo: Todo): void{
        this.todos = this.todos.filter( t => t !== todo)
        this.inform()
    }

    toggleTodo(todo: Todo): void{
        //...t  prendre toutes les options, completed est remplace par le parametre
        this.todos = this.todos.map(t => t === todo ? {...t, completed: !t.completed}: t)
        this.inform()
    }

    toggleAll(completed = true){
        this.todos = this.todos.map( t => t.completed != completed ? {...t, completed}: t)
        this.inform()
    }

    updateTitle(todo: Todo, title: string): void{
        this.todos = this.todos.map(t => t === todo ? {...t, title}: t)
        this.inform()
    }

    clearCompleted(): void{
        this.todos = this.todos.filter( t => !t.completed)
        this.inform()
    }
}