import java.util.*;
import java.util.Scanner;
public class FibNonRec {
    public static void main(String[] args) {
        int n=20;
        for(int i=0;i<n;i++){
            System.out.print(FibNonRecurse(i)+" ");
        }
    }
    static int FibNonRecurse(int n){
        int arr[]=new int[n+2];
        arr[0]=0;
        arr[1]=1;
        for(int i=2;i<=n;i++){
            arr[i]=arr[i-1]+arr[i-2];
        }
        return arr[n];
    }
}
