package tool;

import java.io.IOException; //IOException is a checked exception, meaning it either has to be caught or thrown. In loquent, it's thrown all the way up through the program...
import java.io.PrintWriter; //used for outputting text to files, consoles, and more
import java.util.Arrays; //helper class for static methods that work with arrays
import java.util.List; //interface that is implemented by ArrayList and LinkedList; often used for programs where it doesn't matter what type of list is passed through

public class GenerateAst {
    public static void main(String[] args) throws IOException{
        if(args.length != 1){
            //only takes 1 argument
            System.err.println("Usage: generate_ast <output directory>");
            System.exit(64);
        }
        String outputDir = args[0]; //the output goes to the first and only argument 
        //defineAst is the method that creates Expr.java file with the expressions listed in the Arrays.asList() 
        defineAst(outputDir, "Expr", Arrays.asList(
            "Assign : Token name, Expr value",
            "Binary : Expr left, Token operator, Expr right",
            "Call : Expr callee, Token paren, List<Expr> arguments", //Token paren is used for error reporting
            "Get : Expr object, Token name",
            "Grouping : Expr expression",
            "Literal : Object value",
            "Logical : Expr left, Token operator, Expr right",
            "Set : Expr object, Token name, Expr value",
            "Super : Token keyword, Token method",
            "This : Token keyword",
            "Unary : Token operator, Expr right",
            "Variable : Token name"
        ));

        defineAst(outputDir, "Stmt", Arrays.asList(
            "Block : List<Stmt> statements",
            "Class : Token name, Expr.Variable superclass, List<Stmt.Function> methods",
            "Expression : Expr expression",
            "Function : Token name, List<Token> params, List<Stmt> body",
            "If : Expr condition, Stmt thenBranch, Stmt elseBranch", 
            "Print : Expr expression",
            "Return : Token keyword, Expr value",
            "Var : Token name, Expr initializer",
            "While : Expr condition, Stmt body"
        ));
    }

    private static void defineAst(
            String outputDir, String baseName, List<String> types) throws IOException{
        String path = outputDir + "/" + baseName + ".java"; //path to the file being created
        PrintWriter writer = new PrintWriter(path, "UTF-8"); //writes text to the file at path

        //preps the new file with its package and necessary imports
        writer.println("package loquent;");
        writer.println("");
        writer.println("import java.util.List;");
        writer.println("");
        writer.println("abstract class " + baseName + " {");

        defineVisitor(writer, baseName, types);

        //now, to create the AST classes
        for(String type : types){
            String className = type.split(":")[0].trim();
            String fields = type.split(":")[1].trim();
            defineType(writer, baseName, className, fields); //this is what creates the code for each class under Expr
        }

        writer.println();
        writer.println("  abstract <R> R accept(Visitor<R> visitor);");

        writer.println("}");
        writer.close();
    }

    private static void defineVisitor(
            PrintWriter writer, String baseName, List<String> types){
        writer.println("  interface Visitor<R> {");

        for (String type : types){
            String typeName = type.split(":")[0].trim();
            writer.println("    R visit" + typeName + baseName + "(" + typeName + " " + baseName.toLowerCase() + ");");
        }

        writer.println("  }");
    }

    private static void defineType(
            PrintWriter writer, String baseName, String className, String fieldList){
        writer.println("    static class " + className + " extends " + baseName + " {");

        //creates class constructor
        writer.println("        " + className + "(" + fieldList + ") {");

        //stores parametes in fields
        String[] fields = fieldList.split(", ");
        for (String field : fields){
            String name = field.split(" ")[1];
            writer.println("            this." + name + " = " + name + ";");
        }

        writer.println("    }");

        writer.println();
        writer.println("    @Override");
        writer.println("    <R> R accept(Visitor<R> visitor){");
        writer.println("        return visitor.visit" + className + baseName + "(this);");
        writer.println("    }"); 

        //fields
        writer.println();
        for (String field : fields){
            writer.println("      final " + field + ";");
        }

        writer.println("  }");
        }
}
