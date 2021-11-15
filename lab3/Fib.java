import java.util.*;
import java.util.Scanner;
class Fib{
    public static void main(String[] args) {
        Scanner sc = new Scanner (System.in);
        int n=sc.nextInt();
        System.out.println(FibRecurse(n));
    }

    public static int FibRecurse (int n){
        if(n<=1){  
            return n;      
        }      
        else{
            return FibRecurse(n-1)+FibRecurse(n-2);
        }
    }
}