import java.util.*;
import java.util.Scanner;
class MaxNum{
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        String[] salaryParts = new String[n];
        for (int i = 0; i < n; i++) {
            salaryParts[i] = scanner.next();
        }
        System.out.println(largestNumber(salaryParts));
    }
    
    private static String largestNumber(String[] salaryParts) {
        int numParts = salaryParts.length;
        if (salaryParts == null || numParts == 0)
            return " " ;

        String[] maxSalary = new String[numParts];
        for (int i = 0; i < numParts; ++i) {
            maxSalary[i] = String.valueOf(salaryParts[i]);
        }

        Arrays.sort(maxSalary, (s1, s2) -> (s2 + s1).compareTo(s1 + s2));

        StringBuilder ms = new StringBuilder();
        for (String salaryPart : maxSalary) {
            ms.append(salaryPart);
        }
        return ms.toString();
    }
}