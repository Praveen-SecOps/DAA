import java.util.*;
import java.util.Scanner;

class greedy
{
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the total distance the car is travelling: ");
        int d = scanner.nextInt();
        System.out.println("Enter the total distance the car can travel with full tank: ");
        int tank = scanner.nextInt();  
        System.out.println("Total no.of gas station stops on the way is? ...: ");
        int n = scanner.nextInt();      
        int stops[] = new int[n+2];
        stops[0] = 0;
        stops[n+1] = d;
        System.out.println("Enter the numbers at what distance are the gas stations are placed from the start point: ");
        for (int i = 1; i <= n; i++) {
            System.out.print("Gas station "+i+" is present at ");
            stops[i]=scanner.nextInt();
        }
         
        System.out.println("Total no.of gas stations where the car needs to stop in order to complete the travel is: "+MinRefill(d,tank,stops,n));
    }
    
    static int MinRefill(int d,int tank,int stops[],int n){
        int current_refills=0;
        int last_refill=0;
        int num_refills=0;
        while(current_refills<=n) {
            last_refill = current_refills;
            while ((current_refills <= n) && (stops[current_refills + 1] - stops[last_refill]) <= tank) {
                current_refills ++;
            }
 
            if (current_refills == last_refill)
                return -1;
            if (current_refills <= n)
                num_refills ++;
        }
        return num_refills;
    }
}