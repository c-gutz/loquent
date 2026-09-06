package loquent;

import java.util.List;

class LoquentFunction implements LoquentCallable {
    private final Stmt.Function declaration;
    private final Environment closure;

    private final boolean isInitializer;

    LoquentFunction(Stmt.Function declaration, Environment closure, boolean isInitializer){
        this.isInitializer = isInitializer;
        this.closure = closure;
        this.declaration = declaration;
    }

    LoquentFunction bind(LoquentInstance instance){
        Environment environment = new Environment(closure);
        environment.define("this", instance);
        return new LoquentFunction(declaration, environment, isInitializer);
    }

    @Override
    public String toString(){
        return "<fn " + declaration.name.lexeme + ">";
    }

    @Override
    public int arity(){
        return declaration.params.size();
    }

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments){
        Environment environment = new Environment(closure); //creates an env beneath the global environment (scoping)
        for(int i = 0; i < declaration.params.size(); i++){
            environment.define(declaration.params.get(i).lexeme, arguments.get(i)); //turns parameters into local vars
        }

        try{
            interpreter.executeBlock(declaration.body, environment);
        } catch(Return returnValue){
            if(isInitializer) return closure.getAt(0, "this");

            return returnValue.value;
        }

        if(isInitializer) return closure.getAt(0, "this");
        return null;
    }
}
