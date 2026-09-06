package loquent;

import java.io.BufferedReader; //makes it so that you can read lines of input, as opposed to strings with InputStreamReader
import java.io.IOException; //IOException is a checked exception, meaning it either has to be caught or thrown. In loquent, it's thrown all the way up through the program...
import java.io.InputStreamReader; //works with BufferedReader to handle user input; only capable of handling a character at a time on its own.
//System.in generates a byte stream; InputStreamReader creates a chararacter stream; BufferedReader groups these by line

import java.nio.charset.Charset; //converts inputted bytes to characters
import java.nio.file.Files; //utility class that handles file operations
import java.nio.file.Paths; //creates Path objects that represent file paths
import java.util.List;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

//handles the command line starting of the program and the actual running of Loquent code

public class Loquent {
    private static final Interpreter interpreter = new Interpreter();

    static boolean hadError = false;
    static boolean hadRuntimeError = false;
    public static void main(String[] args) throws IOException{
        if(args.length > 1){
            System.out.println("Usage: jloquent [script]"); //not meant to be run with mutliple arguments
            System.exit(64);
        } else if(args.length == 1){
            runFile(args[0]);
        } else{
            runPrompt();
        }
    }

    public static String runSource(String source) {
        hadError = false;
        hadRuntimeError = false;

        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        PrintStream sink = new PrintStream(captured, true, StandardCharsets.UTF_8);
        PrintStream oldOut = System.out;
        PrintStream oldErr = System.err;

        System.setOut(sink);
        System.setErr(sink);

        try {
            run(source);
        } catch (Throwable t) {
            System.out.println("Internal error: " + t);
        } finally {
            System.setOut(oldOut);
            System.setErr(oldErr);
            sink.flush();
        }

        return captured.toString(StandardCharsets.UTF_8);
    }

    private static void runFile(String path) throws IOException{
        byte[] bytes = Files.readAllBytes(Paths.get(path));
        run(new String(bytes, Charset.defaultCharset())); //processes the file's characters

        if(hadError) System.exit(65); //exists if the program results in an error
        if(hadRuntimeError) System.exit(70);
    }

    private static void runPrompt() throws IOException{
        InputStreamReader input = new InputStreamReader(System.in);
        BufferedReader reader = new BufferedReader(input);
        for(;;){  //infinite loop, fancy edition
            System.out.print("> ");
            String line = reader.readLine(); //reads a line of user input
            if(line == null) break; //if exitted, the loop breaks
            run(line);  //now it processes the user input
            hadError = false;
        }
    }

    private static void run(String source){
        Scanner scanner = new Scanner(source);
        List<Token> tokens = scanner.scanTokens(); //List<E> is an interface, not a class. Classes like ArrayList and LinkedList implement it. Basically, it exists to tell the program that tokens should a list, but it doesnt care if it's assigned to an ArrayList or a LinkedList.

        Parser parser = new Parser(tokens);
        List<Stmt> statements = parser.parse();

        //stop for syntax error
        if(hadError) return;

        Resolver resolver = new Resolver(interpreter);
        resolver.resolve(statements);

        //stop for resolution error
        if(hadError) return;

        interpreter.interpret(statements);
    }

    static void error(int line, String message){ //this method has no access modifier. this means it's package-protected, aka only visible from within the package 
        report(line, "", message); //reports the given message and line of a given error
    }

    private static void report(int line, String where, String message){
        System.err.println("[line " + line + "] Error" + where + ": " + message); //prints the error to the error log
        hadError = true;
    } 

    static void error(Token token, String message){
        if (token.type == TokenType.EOF){
            report(token.line, " at end", message);
        } else {
            report(token.line, " at'" + token.lexeme + "'", message);
        }
    }

    static void runtimeError(RuntimeError error){
        System.err.println(error.getMessage() + "\n[line " + error.token.line + "]");
        hadRuntimeError = true;
    }
}