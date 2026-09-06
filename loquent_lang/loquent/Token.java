package loquent;

//this creates the general structure of each individual token of a Loquent program

class Token {
    final TokenType type; //the type of token that it actually is
    final String lexeme;  //the characters that make up this token, so if the tokentype is VAR, the lexeme is var
    final Object literal; //for a string literal, the literal would be "string_value"
    final int line; //the line on which the token falls

    Token(TokenType type, String lexeme, Object literal, int line) { //this has no return type and the same name as the class; thus, it is a constructor. Basically when "new Token(type, lexeme, literal, line)" is called, it creates a Token object with the following values as instance variables.
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public String toString(){
        return type + " " + lexeme + " " + literal;
    }

}
