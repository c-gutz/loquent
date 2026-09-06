package loquent;

//this is for the tokens that the Lox Scanner generates; specifically, this defines the different types of tokens that exist

enum TokenType { //safer way to store constants, alongisde methods in some situations
    //stores all the possible types that a token might be

    //single-char tokens
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE, COMMA, DOT, MINUS, PLUS, SEMICOLON, STAR, SLASH,
    
    //one or two char tokens
    BANG, BANG_EQUAL, EQUAL, EQUAL_EQUAL, GREATER, GREATER_EQUAL, LESS, LESS_EQUAL, 

    //literals
    IDENTIFIER, STRING, NUMBER,

    //keywords
    AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR, PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE, 
    
    //end of file token
    EOF
}
