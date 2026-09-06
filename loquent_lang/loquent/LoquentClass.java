package loquent;

import java.util.List;
import java.util.Map; 

class LoquentClass implements LoquentCallable{
    final String name;
    final LoquentClass superclass;
    private final Map<String, LoquentFunction> methods;

    LoquentClass(String name, LoquentClass superclass, Map<String, LoquentFunction> methods){
        this.superclass = superclass;
        this.name = name;
        this.methods = methods;
    }

    LoquentFunction findMethod(String name){
        if(methods.containsKey(name)){
            return methods.get(name);
        }

        if(superclass != null){
            return superclass.findMethod(name);
        }

        return null;
    }

    @Override
    public String toString(){
        return name;
    }

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments){
        LoquentInstance instance = new LoquentInstance(this);
        LoquentFunction initializer = findMethod("init");
        if(initializer != null){
            initializer.bind(instance).call(interpreter, arguments);
        }

        return instance;
    }

    @Override
    public int arity(){
        LoquentFunction initializer = findMethod("init");
        if (initializer == null) return 0;
        return initializer.arity();
    }
}
