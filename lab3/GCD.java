import java.lang.Math;
import java.util.Scanner;
public class GCD {
    static int GCD(int a,int b) {
        int maximum=Math.max(a,b);
        int currentNumber=maximum-1;
        while(currentNumber>1){
            if((a%currentNumber==0)&&(b%currentNumber==0)){
                return currentNumber;
            } 
            else {
                currentNumber--;
            }
        }
        return 1;
    }
    public static void main(String[] args){
        System.out.println(GCD(40,48));
    }
}