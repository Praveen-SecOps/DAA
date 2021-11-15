import java.util.Arrays;
import java.util.Comparator;
public class NearNeigh{
private static double bestDistance = 
Double.POSITIVE_INFINITY;
public static double dist(Point p1, Point p2) {
return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + 
(p1.y - p2.y) * (p1.y - p2.y));
}
public static double bruteForce(Point[] p) {
double min = Double.MAX_VALUE;
for (int i = 0; i < p.length - 1; i++) {
for (int j = 1; j < p.length; j++) {
double dist = dist(p[i], p[j]);
if(dist < min) min = dist;
}
}
return min;
}
public static double closest(Point[] p) {
int n = p.length;
Point[] pointsByX = new Point[n];
Point[] pointsByY = new Point[n];
for (int i = 0; i < n; i++) {
pointsByX[i] = p[i];
}
Arrays.sort(pointsByX, new 
Comparator<Point>() {
@Override
public int compare(Point p1, Point p2) {
return p1.x - p2.x;
}
});
for (int i = 0; i < n; i++) {
pointsByY[i] = pointsByX[i];
}
Point[] aux = new Point[n];
return helper(pointsByX, pointsByY, aux, 0, n -
1);
}
public static double helper(Point[] pointsByX, 
Point[] pointsByY, Point[] aux, int lo, int hi) {
if (lo >= hi) return Double.POSITIVE_INFINITY;
int mid = lo + (hi - lo) / 2;
Point midPoint = pointsByX[mid];
double delta1 = helper(pointsByX, pointsByY, 
aux, lo, mid);
double delta2 = helper(pointsByX, pointsByY, 
aux, mid + 1, hi);
double delta = Math.min(delta1, delta2);
merge(pointsByY, aux, lo, mid, hi);
int m = 0;
for (int i = lo; i <= hi; i++) {
if (Math.abs(pointsByY[i].x - midPoint.x) < delta) 
{
aux[m++] = pointsByY[i];
}
}
 for (int i = 1; i < m; i++) {
 
 for (int j = i+1; (j < m) && (aux[j].y -
aux[i].y < delta); j++) {
 double distance = dist(aux[i], aux[j]);
 if (distance < delta) {
 delta = distance;
 if (distance < bestDistance) {
 bestDistance = delta;
 }
 }
 }
 }
 return delta;
}
private static void merge(Point[] a, Point[] aux, 
int lo, int mid, int hi) {
for (int k = lo; k <= hi; k++) {
aux[k] = a[k];
}
int i = lo, j = mid + 1;
for (int k = lo; k <= hi; k++) {
if ( i > mid) a[k] = aux[j++];
else if (j > hi) a[k] = aux[i++];
else if (aux[i].y < aux[j].y) a[k] = aux[i++];
else a[k] = aux[j++];
}
}
public static void main(String[] args) {
Point P[] = {new Point(11,0), new Point(4,4), 
new Point(-2,-2),new Point(-3,-4), new Point(-
1,3), new Point(2,3),new Point(-4,0), new 
Point(1,1), new Point(-1,-1),new Point(3,-1), new 
Point(-4,2), new Point(-2,4) };
closest(P);
System.out.println("The optimum distance will be: "+bestDistance);
}
}
class Point{
int x, y;
public Point(int x, int y) {
this.x = x;
this.y = y;
}
}