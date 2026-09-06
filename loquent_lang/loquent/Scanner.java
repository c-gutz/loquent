package loquent;

import java.util.ArrayList; //Collection type that is more flexible than a regular array because it can expand
import java.util.HashMap; //like a python dictionary; key-value pairs
import java.util.List; //interface that is implemented by ArrayList and LinkedList; often used for programs where it doesn't matter what type of list is passed through
import java.util.Map; //the interface for maps; equivalent to the List interface but for maps; lets you write programs that accept any type of map; ie HashMap, TreeMap, LinkedHasMap

import static loquent.TokenType.*; //while TokenType is package-protected (no access modifier) and in the same package as the Scanner class (meaning they can access eachother), this line is used so that the Scanner can access TokenType's static members easier; ie writing IDENTIFIER as opposed to TokenType.IDENTIFIER

class Scanner {
    private final String source; //this is the character string that is passed into the run() method in Loquent.java to represent source code
    private final List<Token> tokens = new ArrayList<>(); //this is a list of the code's tokens that will be added to as the Scanner progresses
    private int start = 0; //points to the first character in a lexeme
    private int current = 0; //current is the character currently being considered
    private int line = 1; //the line of a token

    private static final Map<String, TokenType> keywords; //defines the map of keywords and token types
    static { //runs as once as class is loaded; needed b/c keywords takes multiple statements to fill, and statements in java must be within a method or block(like static{})
        keywords = new HashMap<>(); //key value pairs
        keywords.put("and", AND); //same as Lox
        keywords.put("class", CLASS); //same as Lox
        keywords.put("otherwise", ELSE); //replacing 'else'
        keywords.put("spurious", FALSE); //replacing 'false'
        keywords.put("through", FOR); //replacing 'for'
        keywords.put("function", FUN); //replacing 'fun'
        keywords.put("provided", IF); //replacing 'if'
        keywords.put("inutile", NIL); //replacing 'nil'
        keywords.put("or", OR); //same as Lox
        keywords.put("aver", PRINT); //replacing 'print'
        keywords.put("yield", RETURN); //replacing 'return'
        keywords.put("super", SUPER); //same as Lox
        keywords.put("this", THIS); //replacing 'this'
        keywords.put("veritable", TRUE); //replacing 'true'
        keywords.put("delineate", VAR); //replacing 'var'
        keywords.put("whilst", WHILE); //replacing 'while'

        /*
        Original Lox keywords -- remove above and uncomment this to return to og lang
        keywords.put("and", AND);
        keywords.put("class", CLASS);
        keywords.put("else", ELSE);
        keywords.put("false", FALSE);
        keywords.put("for", FOR);
        keywords.put("fun", FUN);
        keywords.put("if", IF);
        keywords.put("nil", NIL);
        keywords.put("or", OR);
        keywords.put("print", PRINT);
        keywords.put("return", RETURN);
        keywords.put("super", SUPER);
        keywords.put("this", THIS);
        keywords.put("true", TRUE);
        keywords.put("var", VAR);
        keywords.put("while", WHILE);
         */
    }

    Scanner(String source) {
        this.source = source; //constructs a scanner with a source of parameter source
    }

    List<Token> scanTokens(){
        while(!isAtEnd()){ //makes sure the source code hasn't reached the end
            start = current;
            scanToken();
        }

        tokens.add(new Token(EOF, "", null, line)); //represents the end of the file and is fittingly added to the tokens list after the loop
        return tokens;
    }

    private void scanToken(){
        char c = advance();
        switch(c){
            //checks the current character to see if it's a one-character token
            case '(': addToken(LEFT_PAREN); break;
            case ')': addToken(RIGHT_PAREN); break;
            case '{': addToken(LEFT_BRACE); break;
            case '}': addToken(RIGHT_BRACE); break;
            case ',': addToken(COMMA); break;
            case '.': addToken(DOT); break;
            case '-': addToken(MINUS); break;
            case '+': addToken(PLUS); break;
            case ';': addToken(SEMICOLON); break;
            case '*': addToken(STAR); break;

            //some tokens can work either as 1 character or as multiple, ie ! and !=
            case '!':
                addToken(match('=') ? BANG_EQUAL : BANG); //if the next token is =, then the token is !=, else it's just !
                break;
            case '=': 
                addToken(match('=') ? EQUAL_EQUAL : EQUAL);
                break;
            case '<':
                addToken(match('=') ? LESS_EQUAL : LESS);
                break;
            case '>':
                addToken(match('=') ? GREATER_EQUAL : GREATER);
                break;

            // the division (/) operator is special because it can also represent a comment (//)
            case '/':
                if(match('/')){ //basically it's a comment
                    //checks whether the next character is a new line (end of comment) or if the source code has ended
                    while(peek() != '\n' && !isAtEnd()) advance();
                } else {
                    //regular division token
                    addToken(SLASH);
                }
                break; 
            
            //meaningless characters that the scanner can ignore
            case ' ':
            case '\r': 
            case '\t': 
                //ignore whitespace
                break;

            case '\n': 
                //new line
                line++;
                break;

            //now for strings
            case '"': string(); break;
            
            default: 
                if (isDigit(c)){
                    number();
                } else if(isAlpha(c)){
                    identifier(); //assumes that any lexeme beginning with a letter/underscore is an identifier, useful for checking if it's reserved
                } else {
                    Loquent.error(line, "Unexpected character"); //calls the error method defined in Loquent.java
                }
                break;
        }
    }

    private void identifier(){
        while(isAlphaNumeric(peek())) advance(); //continues to the end of the identifier; identifier can include numbers, just can't begin with them

        String text = source.substring(start, current); //the identifier in full string form glory
        TokenType type = keywords.get(text); //checks if the identifier matches a keyword
        if(type == null) type = IDENTIFIER; //if not, it's a regular user-created identifier
        addToken(type);
    }

    private void number(){
        while(isDigit(peek())) advance(); //checks if the next character is also a digit; if yes, increments current, moves to the next character, and tries again

        //now check for a fractional part
        if(peek() == '.' && isDigit(peekNext())){ //checks if the next character is a '.' and the next, next character is a digit (aka fraction)
            advance(); //progresses to next character (aka tenth place)

            while(isDigit(peek())) advance(); //same as the firs time, but captures all the digits after the '.'
        }

        addToken(NUMBER, Double.parseDouble(source.substring(start, current))); //Double.parseDouble() converts strings into Doubles
    }

    private void string(){
        while(peek() != '"' && !isAtEnd()){ //checks to see if either the string sequence ended or the source code
            if(peek() == '\n') line++; //if the string is multiple lines then increment line
            advance(); 
        }
        if(isAtEnd()){
            Loquent.error(line, "Unterminated string.");
            return;
        }

        //this line gets called when isAtEnd() is false and peek() == '"', meaning the string is closing
        advance();
        String value = source.substring(start+1, current-1); //the value of the string, minus the oepning and closing quotes
        addToken(STRING, value);
    }

    private boolean match(char expected){
        if(isAtEnd()) return false; //the next character cannot be the epected value if there is no next character
        if (source.charAt(current) != expected) return false; //advance increases current by 1 every time, so current is already set to the next character in the sequence; thus, charAt(current) works to evaluate the next character

        current++; //if the program has made it here, the next character is expected. this is logged back to ScanToken(), and current advances
        return true;
    }

    private char peek() {
        if(isAtEnd()) return '\0'; //lets the program know that the end has been reached
        return source.charAt(current); //otherwise returns the current character
    }

    private char peekNext(){
        if(current + 1 >= source.length()) return '\0'; //lets the program know that the source file end has been reached
        return source.charAt(current + 1); //returns the next, next character if the source file end hasn't been reached
    }

    private boolean isAlpha(char c){
        //return true if the character is a letter or underscore
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               (c == '_');
    }

    private boolean isAlphaNumeric(char c){
        return isAlpha(c) || isDigit(c); //true if either a letter, underscore, or digit. this is because identifiers can include numbers too
    }

    private boolean isDigit(char c){
        return c >= '0' && c <= '9'; //all characters with unicodes between 48 and 57; aka digits
    }

    private boolean isAtEnd(){
        return current >= source.length(); //checks if the source code length has been exceeded
    }

    private char advance() {
        return source.charAt(current++); //this gets the character at the current position and THEN adds 1 to current to keep traversing
    }

    private void addToken(TokenType type){
        addToken(type, null); //calls the same method but with null for the Object literal
    }

    private void addToken(TokenType type, Object literal){
        String text = source.substring(start, current); //gets the actual lexeme text of the token
        tokens.add(new Token(type, text, literal, line)); //adds a new Token element to the tokens list 
    }
}
