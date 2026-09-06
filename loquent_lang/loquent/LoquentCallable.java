package loquent;

import java.util.List;

interface LoquentCallable {
    int arity();
    Object call(Interpreter interpreter, List<Object> arguments);
}
