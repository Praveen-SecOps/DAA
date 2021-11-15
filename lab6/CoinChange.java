import java.util.*;
import java.util.Scanner;
class CoinChange{
    static int dnm[] = {1, 5, 10};
    static int n = dnm.length;

    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter the total coins value: ");
        int n = sc.nextInt();
        System.out.println("Theese are the minimum number of coins required: ");
        findMin(n);
        
    }
    static void findMin(int V)
    {
        Vector<Integer> ans = new Vector<>();
  
        for (int i=n-1;i>=0;i--)
        {
            while (V>=dnm[i]) 
            {
                V=V-dnm[i];
                ans.add(dnm[i]);
            }
        }
        for (int i=0;i<ans.size();i++)
        {
            System.out.println(ans.elementAt(i));
        }
    }
}