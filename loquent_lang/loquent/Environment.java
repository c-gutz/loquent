package loquent;

import java.util.HashMap; //Java equivalent to a Python dictionary
import java.util.Map;

//the environment is where variables and their values are stored
class Environment {
    final Environment enclosing; //used when handling scoped variables; environments within environments
    private final Map<String, Object> values = new HashMap<>();

    Environment(){
        enclosing = null; //this is the highest level environment (global)
    }

    Environment(Environment enclosing){
        this.enclosing = enclosing; //an environment within another; references the higher level environment under which it is enclosed
    }

    Object get(Token name){
        //this retrieves the value from a variable given its name
        if(values.containsKey(name.lexeme)){
            return values.get(name.lexeme);
        }

        if(enclosing != null) return enclosing.get(name); //recursively walks up through environment levels until it finds variable
        //if no variable is found, throw error
        throw new RuntimeError(name, 
            "Undefined variable '" + name.lexeme + "'.");
    }

    void assign(Token name, Object value){
        //similar to define but not used to create a new variable. can only be called on existing variable
        if(values.containsKey(name.lexeme)){
            values.put(name.lexeme, value);
            return;
        }

        if(enclosing != null){
            enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name, 
            "Undefined variable '" + name.lexeme +"'.");
    }

    void define(String name, Object value){
        //variable definition puts a value to a name
        values.put(name, value);
    }

    Environment ancestor(int distance){
        Environment environment = this;
        for(int i = 0; i < distance; i++){
            environment = environment.enclosing; //travels up the environment until the distance specificed by the Resolver
        }

        return environment;
    }

    Object getAt(int distance, String name){
        return ancestor(distance).values.get(name);
    }

    void assignAt(int distance, Token name, Object value){
        ancestor(distance).values.put(name.lexeme, value);
    }
}
